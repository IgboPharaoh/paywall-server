import { Response } from 'express';
import { DataResponse, ErrorResponse, ErrorValidationResponse, ResponseType } from '../interfaces';

export const responseSuccess = ({ res, status, msg, data }: Omit<ResponseType, 'errors'>): Response => {
    const result: DataResponse = {
        msg,
        data,
    };

    return res.status(status).send(result);
};

export const responseError = ({ res, status, msg }: Omit<ResponseType, 'data' | 'errors'>): void => {
    const result: ErrorResponse = {
        msg,
    };

    res.status(status).send(result);
};

export const responseValidationError = ({ status, errors, res }: Omit<ResponseType, 'data' | 'msg'>): void => {
    const result: ErrorValidationResponse = {
        msg: 'Validation Error',
        errors,
    };

    res.status(status).send(result);
};
