import { BaseEntity, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class AuthToken extends BaseEntity implements IAuthToken
{
    @PrimaryGeneratedColumn('uuid')
    token: string;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @ManyToOne(type => User, user => user.tokens)
    user: User;
}

export interface IAuthToken
{
    token: string;
}
