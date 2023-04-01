import express, { Application, Express, NextFunction, Request, Response } from 'express';
import env from './helpers/env';
import ArticlesManager from './articles';
import { lnNode } from './helpers/node';
import cors from 'cors';
import bodyParser from 'body-parser';
import { responseError } from './helpers';
import http from 'http';
import routes from './routes';
import { Server } from 'socket.io';

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

app.get('/', (req: Request, res: Response) => {
    res.send(`server set up`);
});

app.get('/api/pay-invoice/:articleId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userPubKey, articleId, amount } = req.body;
        if (!userPubKey) {
            throw new Error('User credentials are need to pay an invoice');
        }
        const article = ArticlesManager.payNewArticle(articleId, amount, userPubKey);
        const invoice = await lnNode.addInvoice({
            memo: `new article created #${article.userPubKey}`,
            value: amount,
            expiry: '180',
        });

        res.json({
            data: {
                article,
                payReq: invoice.paymentRequest,
            },
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

app.get('/api/paid-articles/:id', (req: Request, res: Response) => {
    const { userPubKey } = req.params;
    const articles = ArticlesManager.paidArticlesforUser(userPubKey);

    if (userPubKey) {
        res.json({
            data: articles,
        });
    } else {
        res.status(404).json({ error: `User with ${userPubKey} have no paid posts` });
    }
});

app.listen(env.PORT, () => {
    console.log(`application is running at https://localhost:${env.PORT}`);
});
