import { EntityRepository, getConnection, getRepository, Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from '../entity/User';
import { IUser } from '../entity/IUser';
import { AuthToken } from '../entity/AuthToken';

@EntityRepository(User)
export class UserRepository extends Repository<User>
{
    static async hashPassword(password: string) {
        try {
            return await argon2.hash(password, {
                type: argon2.argon2id
            })
        } catch (err) {
            return err;
        }
    }

    async createAndSave(user: IUser) {
        try {

            let newUser: User = new User();
            const pass = await UserRepository.hashPassword(user.password);

            newUser.username = user.username;
            newUser.password = await pass;
            newUser.email = user.email;
            newUser.avatar = user.avatar;

            newUser = await this.manager.create(User, newUser);

            return this.manager.save(newUser);
        } catch (e) {
            return e;
        }

    }

    async findByUsername(username: string) {
        return this.findOne({ username });
    }

    async findByEmail(email: string) {
        return this.findOneOrFail({ email });
    }

    async createAuthToken(username: string) {
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        await queryRunner.connect();

        const user = await queryRunner.manager.findOne(User, { username: username });
        const token = new AuthToken();
        token.user = user;

        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.save(token);
            await queryRunner.commitTransaction();
        } catch (err) {
            console.log(err);
            await queryRunner.rollbackTransaction();
        }

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            token: {
                token: token.token,
                createdAt: token.createdAt
            }
        };
    }

    async verifyPassword(username: string, password: string) {
        return new Promise((resolve, reject) => {
            return this.findOne({ username }).then((user) => {
                argon2.verify(user.password, password).then((check) => {
                    resolve(check);
                }).catch(err => {
                    reject(err);
                })
            });
        });
    }

    async validateToken(userId: string, token: string) {
        return new Promise((resolve, reject) => {
            return this.manager
                .findOneOrFail(AuthToken,{ where: { user: userId, token: token } })
                .then(res => {
                    resolve(res);
                }).catch(err => {
                    reject(err);
                });
        });
    }
}

interface UserResponse extends User {
    token: {
        token: string,
        createdAt: Date
    }
}
