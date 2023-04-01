import { NextFunction, Request, Response } from 'express';
import { emitSocketEvent } from '..';
import { responseError } from '../helpers';
import lnurlServer from '../helpers/lnurl';

export const lnurlLogin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const result = await lnurlServer.generateNewUrl('login');
        res.send(result);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const pseudoLogin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const query = req.query;
        if (query.key) {
            const key = String(query.key);
            emitSocketEvent.emit('auth', { key });

            res.json({ key });
        } else {
            return responseError({ res, status: 400, msg: 'Apologies, unsuccessful auth login' });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};
