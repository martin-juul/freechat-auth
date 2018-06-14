import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { UserRepository } from '../repositories/UserRepository';
import { IUser } from '../entity/IUser';

export let signup = async (req: Request, res: Response) => {
    const connection = getConnection();

    try {
        const signUpRequest = <IUser> req.body;

        await connection.transaction(async manager => {
            const userRepository = manager.getCustomRepository(UserRepository);
            await userRepository.createAndSave(signUpRequest);
            const newUser = await userRepository.findByUsername(signUpRequest.username);

            res.json(newUser);
        });
    } catch (err) {
        res.json(err).status(400);
    }
};

export let signin = async (req: Request, res: Response) => {
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
};

export let validateToken = async (req: Request, res: Response) => {
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
};
