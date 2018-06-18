import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { IUser } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';

export namespace UserController
{
    export async function postGetUser(request: Request, response: Response) {
        const userId = request.body.id;
        const userRepository = getCustomRepository(UserRepository);

        try {
            userRepository.findById(userId).then(user => {
                const responseUser: IUser = {
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar
                };

                response.json(responseUser);
            })
        } catch (err) {
            response.status(500).json({message: 'User not found!'});
        }
    }
}
