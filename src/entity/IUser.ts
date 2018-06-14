import { IAuthToken } from './IAuthToken';

export interface IUser
{
    id?: string;
    username: string;
    password: string;
    email?: string;
    avatar?: string;
    tokens?: IAuthToken[]
    token?: IAuthToken
}
