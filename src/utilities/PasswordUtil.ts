import * as argon2 from 'argon2';

export class PasswordUtil
{
    static async verify(hashedPassword: string, password: string) {
        return argon2.verify(hashedPassword, password);
    }

    static async hash(password: string): Promise<string> {
        try {
            return await argon2.hash(password, {
                type: argon2.argon2id
            })
        } catch (err) {
            return err;
        }
    }
}
