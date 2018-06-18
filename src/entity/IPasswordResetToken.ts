import { User } from './User';

export interface IPasswordResetToken
{
    user: User;
    token: string;
    expires: Date;
}
