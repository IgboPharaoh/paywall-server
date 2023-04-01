import { Response } from 'express';
import { ValidationError } from 'express-validator';

export interface DataResponse {
    msg: string;
    data: any;
}
export interface ErrorResponse {
    msg: string;
}
export interface ErrorValidationResponse {
    msg: string;
    errors: ValidationError[];
}

export interface Article {
    articleId: number;
    hasPaid: boolean;
    amount: number;
    userPubKey: string;
}

export interface ResponseType {
    res: Response;
    status: number;
    msg: string;
    data: any;
    errors: ValidationError[];
}
