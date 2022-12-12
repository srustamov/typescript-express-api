import {DataSource} from "typeorm";
import User from "../entity/User";
import {EntityManager} from "typeorm/entity-manager/EntityManager";
import {env} from "../utils/helpers";

export const AppDataSource : DataSource = new DataSource({
    type: "mariadb",
    host: env('DB_HOST'),
    port: env('DB_POST'),
    username: env('DB_USERNAME'),
    password: env('DB_PASSWORD'),
    database: env('DB_NAME'),
    synchronize: false,
    logging: env('DB_LOGGING',false),
    entities: [
        User
    ],
    subscribers: [],
    migrations: []
})

const Manager: EntityManager = AppDataSource.manager;

const Repository = AppDataSource.getRepository;

export { Manager,Repository };
