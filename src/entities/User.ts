import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AuthToken, IAuthToken } from './AuthToken';

@Entity()
export class User extends BaseEntity implements IUser
{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: false })
    username: string;

    @Column({ nullable: false })
    password: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: true })
    avatar: string;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @OneToMany(type => AuthToken, token => token.user)
    tokens: AuthToken[]
}

export interface IUser
{
    id?: string;
    username: string;
    password?: string;
    email?: string;
    avatar?: string;
    tokens?: IAuthToken[]
    token?: IAuthToken
}
