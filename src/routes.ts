import * as cors from 'cors';
import { CorsOptions } from 'cors';
import { Request, Response } from 'express';
import { AuthController } from './controllers/AuthController';
import { UserController } from './controllers/UserController';

export interface Route
{
    path: string;
    middleware?: Function;
    method: string;
    action: (request: Request, response: Response) => Promise<void>;
}

const whitelistedDomains = [ 'http://localhost:3000', 'http://localhost:4200', 'http://localhost', undefined ];

const corsOptions: CorsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        if (whitelistedDomains.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

export const AppRoutes: Route[] = [
    {
        path: '/auth/signup',
        middleware: cors(corsOptions),
        method: 'post',
        action: AuthController.postSignUp
    },
    {
        path: '/auth/signin',
        middleware: cors(corsOptions),
        method: 'post',
        action: AuthController.postSignIn
    },
    {
        path: '/auth/verify-token',
        middleware: cors(corsOptions),
        method: 'post',
        action: AuthController.postValidateToken
    },
    {
        path: '/user',
        middleware: cors(corsOptions),
        method: 'post',
        action: UserController.postGetUser
    }
];
