import {AppDataSource} from "../database/data-source";
import {EntityManager} from "typeorm";
import {Websocket} from "../websocket/websocket";


export abstract class Controller {

    public getEntityManager(): EntityManager {
        return AppDataSource.manager;
    }

    public getSocket(): Websocket {
        return Websocket.io;
    }

}