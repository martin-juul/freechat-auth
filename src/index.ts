import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Request, Response } from 'express';
import { createConnection } from 'typeorm';
import { AppRoutes, Route } from './routes';

// create connection pool with postgres
createConnection().then(async connection => {
    if (await connection.isConnected) {
        console.log('[server]: connected to database');
    }

    const app = express();

    // Express server config
    app.set('port', process.env.PORT || 3000);

    // support application/json
    app.use(bodyParser.json());
    // support application/x-www-form-urlencoded
    //app.use(bodyParser.urlencoded({ extended: false }));
    // serve files in public directory
    app.use(express.static('public'));

    // register routes
    AppRoutes.forEach((route: Route) => {
        if (route.middleware) {
            app[ route.method ](route.path, route.middleware, (request: Request, response: Response, next: Function) => {
                route.action(request, response)
                    .then(() => next)
                    .catch(err => next(err));
            });
        } else {
            app[ route.method ](route.path, (request: Request, response: Response, next: Function) => {
                route.action(request, response)
                    .then(() => next)
                    .catch(err => next(err));
            });
        }
    });

    // Start server
    const server = app.listen(app.get('port'), () => {
        console.log('[server]: listening on port ' + app.get('port'));
    });
}).catch(err => {
    console.error('[server][error](boot): ', err)
});
