import 'reflect-metadata';
require('dotenv').config({
    path: `${__dirname}/../.env`
})
import {errorHandler} from "./utils/helpers";
// import {authorizationChecker} from "./http/middleware/authorized.middleware";
import {createServer, Server} from 'http';
import {AppDataSource} from "./database/data-source"
// import {Websocket} from './websocket/websocket';
import {createExpressServer} from 'routing-controllers'
import express from 'express'


const port = process.env.APP_PORT || 3000;

const app = createExpressServer({
    // routePrefix: '/',
    controllers: [
        `${__dirname}/http/controllers/**/*`
    ],

    // development:false,
    validation: true,
    classTransformer: true,
    cors: true,
    defaultErrorHandler: false,
    // authorizationChecker: authorizationChecker
});

app.use(express.json());
app.use(express.urlencoded());

app.use(errorHandler)

app.use((request,response,next) => {
    if (!response.headersSent) {
        return response.status(404).json({
            status:false,
            message:"Endpoint not found"
        })
    }

    next()
})

const server: Server = createServer(app);

(async () => await AppDataSource.initialize())();


//if you want to use socket.io
//Websocket.createInstance(server);

server.listen(port, () => {
    console.log(`This is working in port ${port}`);
});