import {Server as HttpServer} from 'http';
import {Server, Socket} from "socket.io";
// import { createAdapter } from "@socket.io/redis-adapter";
// import { createClient } from "redis";
import {AppDataSource} from "../database/data-source";
import User from "../entity/User";
import {AuthService} from "../services/auth.service";
import {HttpError} from "routing-controllers";

export class Websocket extends Server {

    public static io: Websocket;

    constructor(httpServer) {
        super(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
        });
    }

    public static getInstance(httpServer?: HttpServer): Websocket {

        if (!Websocket.io) {
            return Websocket.createInstance(httpServer);
        }

        return Websocket.io;
    }

    public static createInstance(httpServer: HttpServer): Websocket {

        const io = new Websocket(httpServer);


        // Redis adapter if needed
        // const pubClient = createClient({ url: "redis://127.0.0.1:6379" });
        // const subClient = pubClient.duplicate();
        //
        // io.adapter(createAdapter(pubClient, subClient));

        io.use(Websocket.authMiddleware)

        io.on('connection', async function (socket) {

            console.log('connect socket')

            //@ts-ignore
            const user: User = socket.request.user;

            socket.join(user.uuid);

            user.is_online = true;

            await AppDataSource.manager.save(user);

            io.to(user.uuid).emit('connected', user)

            socket.on('disconnect', async () => {

                console.log('disconnect')

                await socket.leave(user.uuid);

                user.is_online = false;

                await AppDataSource.manager.save(user);
            })
        })

        Websocket.io = io;

        return Websocket.io;
    }

    public static async authMiddleware(socket, next) {

        const token = socket.handshake?.auth?.token

        if (token) {
            const user: null | User = await AuthService.findByToken(token)

            if (user) {

                socket.request.user = user;

                return next()
            }
        }

        socket.disconnect(true);

        return next(new HttpError(401, "Unauthorized | Auth token required"))
    }
}
