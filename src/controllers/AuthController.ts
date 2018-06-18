import { Request, Response } from 'express';
import { getConnection, getCustomRepository } from 'typeorm';
import { IUser } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';

export namespace AuthController
{
    export async function postSignUp(request: Request, response: Response) {
        try {
            const signUpRequest = (<IUser>request.body);
            const userRepository = getCustomRepository(UserRepository);

            userRepository.createAndSave(signUpRequest)
                .then(user => {
                    const userResponse: IUser = {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        avatar: user.avatar
                    };
                    response.json(userResponse).sendStatus(201);
                })
                .catch(err => {
                    response.json(err).status(500);
                });

        } catch (err) {
            response.json(err).status(400);
        }
    }

    export async function postSignIn(req: Request, res: Response) {
        const connection = getConnection();
        const loginUser = <IUser> req.body;

        await connection.transaction(async manager => {
            const userRepository = manager.getCustomRepository(UserRepository);
            const isValid = userRepository.verifyPassword(loginUser.username, loginUser.password);

            isValid.then((match) => {
                if (match) {
                    userRepository.createAuthToken(loginUser.username).then((user) => {
                        res.json(user);
                    }).catch(err => {
                        res.status(500).json(err);
                    })
                } else {
                    res.status(401);
                }
            });

        });
    }

    export async function postValidateToken(req: Request, res: Response) {
        const connection = getConnection();
        const userId = req.param('id');
        const userToken = req.param('token');

        await connection.transaction(async manager => {
            const userRepository = manager.getCustomRepository(UserRepository);
            const isValid = userRepository.validateToken(userId, userToken);

            isValid.then(match => {
                if (match) {
                    res.json({
                        message: 'success'
                    });
                } else {
                    res.status(401);
                }
            }).catch(err => {
                console.error(err);
                res.status(500);
            });
        });
    }

}
