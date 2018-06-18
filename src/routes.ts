import { Request, Response } from 'express';
import { AuthController } from './controllers/AuthController';

export interface Route
{
    path: string;
    method: string;
    action: (request: Request, response: Response) => Promise<void>;
}

export const AppRoutes: Route[] = [
    { path: '/auth/signup', method: 'post', action: AuthController.postSignUp },
    { path: '/auth/signin', method: 'post', action: AuthController.postSignIn },
    { path: '/auth/verify-token', method: 'post', action: AuthController.postValidateToken }
];
