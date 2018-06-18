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
                    response.status(201).json(userResponse);
                })
                .catch(err => {
                    response.status(500).json(err);
                });

        } catch (err) {
            response.status(400).json(err);
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

    export async function postValidateToken(request: Request, response: Response) {
        const connection = getConnection();
        const tokenRequest: ValidateTokenRequest = (<ValidateTokenRequest>request.body);

        await connection.transaction(async manager => {
            const userRepository = manager.getCustomRepository(UserRepository);
            const isValid = userRepository.validateToken(tokenRequest.id, tokenRequest.token);

            isValid.then(match => {
                if (match) {
                    response.json({
                        message: 'success'
                    });
                } else {
                    response.status(401);
                }
            }).catch(err => {
                console.error(err);
                response.status(500);
            });
        });
    }

    interface ValidateTokenRequest {
        id: string;
        token: string;
    }

}
