import express, { Application, Express, NextFunction, Request, Response } from 'express';
import env from './helpers/env';
import ArticlesManager from './articles';
import { lnNode, lnrpcWrapper } from './helpers/node';
import cors from 'cors';
import bodyParser from 'body-parser';
import { responseError } from './helpers';
import http from 'http';
import routes from './routes';
import { Server } from 'socket.io';
import { Invoice, Readable } from '@radar/lnrpc';

const app: Application = express();
const server = http.createServer(app);

// middle wares
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        responseError({ res, status: 500, msg: err.message });
    }
});

// app.use('/', routes);
const io = new Server();
let emitSocketEvent: any;

io.on('connection', (socket: any) => {
    console.log(`socket on ${socket.id} was connected`);

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    emitSocketEvent = socket;
});

export { emitSocketEvent };

app.get('/', async (req: Request, res: Response, next) => {
    try {
        const info = await lnNode.getInfo();

        res.send(`
          <h1>Node info</h1>
          <pre>${JSON.stringify(info, null, 2)}</pre>
        `);

        next();
    } catch (err) {
        next(err);
    }
});

app.get('/api', async (req: Request, res: Response, next) => {
    try {

        const stream = lnNode.subscribeInvoices() as any as Readable<Invoice>;
        stream.on('data', (chunk) => {
            // Skip unpaid / irrelevant invoice updates
            if (!chunk.settled || !chunk.amtPaidSat || !chunk.memo) return;

            // Extract article id
            let articleId;
            // `new article created #${article.articleId}`
            if (chunk.settled && chunk.memo) {
                articleId = chunk.memo.substring(chunk.memo.indexOf('#') + 1);
            }

            // Mark the invoice as paid!
            const articles = ArticlesManager.paidArticlesforUser(articleId);

            res.send({
                articles: articles,
            });
        });

        // `);
        next();
    } catch (err) {
        next(err);
    }
});

app.post('/api/pay-invoice/:articleId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { articleId } = req.params;
        const { userPubKey, amount } = req.body;

        if (!userPubKey) {
            throw new Error('User credentials are need to pay an invoice');
        }
        console.log(userPubKey, amount, articleId);

        const article = ArticlesManager.payNewArticle(articleId, amount, userPubKey);
        const invoice = await lnNode.addInvoice({
            memo: `new article created #${article.articleId}`,
            value: amount,
            expiry: '180',
        });

        res.json({
            data: {
                article,
                payReq: invoice.paymentRequest,
                userPubKey,
            },
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

app.get('/api/paid-articles/:userPubKey', (req: Request, res: Response) => {
    const { userPubKey } = req.body;
    const articles = ArticlesManager.paidArticlesforUser(userPubKey);

    if (userPubKey) {
        res.json({
            data: articles,
        });
    } else {
        res.status(404).json({ error: `User with ${userPubKey} have no paid posts` });
    }
});

lnrpcWrapper().then(() => {
    console.log('lightning node initialized');
    console.log('Starting server.........');

    app.listen(env.PORT, () => {
        console.log(`application is running at https://localhost:${env.PORT}`);
    });

    io.on('connection', (socket: any) => {
        // Subscribe to all invoices, mark paid articles
        const stream = lnNode.subscribeInvoices() as any as Readable<Invoice>;
        stream.on('data', (chunk) => {
            // Skip unpaid / irrelevant invoice updates
            if (!chunk.settled || !chunk.amtPaidSat || !chunk.memo) return;

            // `new article created #${article.articleId}`
            if (chunk.settled === true && chunk.memo) {
                socket.emit('payment-confirmed', chunk);
            }

            // Extract article id
            let articleId;
            if (chunk.settled && chunk.memo) {
                const index = chunk.memo.indexOf('#');
                articleId = chunk.memo.substring(index);

                ArticlesManager.paidArticlesforUser(articleId);
                socket.emit('payment-confirmed-with-id', { chunk, articleId });
            }

        });
    });
});
