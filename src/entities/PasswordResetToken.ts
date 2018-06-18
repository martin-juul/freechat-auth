import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class PasswordResetToken extends BaseEntity implements IPasswordResetToken
{
    // A user is only allowed to have 1 password reset token
    // therefore it makes sense to use the users id as primary column.
    @PrimaryColumn({ type: 'uuid', nullable: false, unique: true })
    @OneToOne(type => User, user => user.id)
    @JoinColumn()
    user: User;

    @Column({ type: 'timestamptz', nullable: false })
    expires: Date;

    @Column({ unique: true, nullable: false, type: 'uuid' })
    token: string;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
}

export interface IPasswordResetToken
{
    user: User;
    token: string;
    expires: Date;
}
