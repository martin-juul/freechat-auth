import { EntityRepository, getConnection, Repository } from 'typeorm';
import { AuthToken } from '../entities/AuthToken';
import { IUser, User } from '../entities/User';
import { PasswordUtil } from '../utilities/PasswordUtil';

@EntityRepository(User)
export class UserRepository extends Repository<User>
{

    async createAndSave(user: IUser): Promise<User> {
        try {
            const queryRunner = await UserRepository.getQueryRunner();
            const pass = await PasswordUtil.hash(user.password);

            let newUser: User = new User();

            newUser.username = user.username;
            newUser.password = await pass;
            newUser.email = user.email;
            newUser.avatar = user.avatar;

            await queryRunner.startTransaction();
            try {
                await queryRunner.manager.save(newUser);
                await queryRunner.commitTransaction();
            } catch (err) {
                console.error('[UserRepository](createAndSave): ', err);
                await queryRunner.rollbackTransaction();
                return err;
            }

            return await newUser;
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
        const queryRunner = await UserRepository.getQueryRunner();

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
                PasswordUtil.verify(user.password, password).then((check) => {
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
                .findOneOrFail(AuthToken, { where: { user: userId, token: token } })
                .then(res => {
                    resolve(res);
                }).catch(err => {
                    reject(err);
                });
        });
    }

    private static async getQueryRunner() {
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        await queryRunner.connect();
        return queryRunner;
    }
}
