import * as express from 'express';
import * as bodyParser from 'body-parser';
import { createConnection } from 'typeorm';
import * as userController from './controllers/UserController';

const app = express();
export const connection = createConnection();


// Express server config
app.set("port", process.env.PORT || 3000);
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, X-FREECHAT-TOKEN, Access-Control-Allow-Origin");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
// support application/json
app.use(bodyParser.json());
// support application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// serve files in public directory
app.use(express.static('public'));

connection.then(() => {
    console.log('[server]: connected to database');
});

/**
 * Routes
 */

app.post('/user/signup', userController.signup);
app.post('/user/signin', userController.signin);
app.get('/user/verify-token', userController.validateToken);

export default app;
