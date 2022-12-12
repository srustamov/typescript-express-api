import {EntityManager} from "typeorm";
import {AppDataSource} from "../database/data-source";

export abstract class Model {
    public static async create<T extends Model>(data: T|object): Promise<T> {
        let model = Reflect.construct(this, []) as T;

        for (const [key, value] of Object.entries(data)) {
            model[key] = value;
        }

        return await AppDataSource.manager.save(model);
    }

    public async save<T extends Model>(): Promise<any> {
        return await AppDataSource.manager.save(this);
    }

    public static createNewInstance<T extends Model>(): T {
        return Reflect.construct(this, []) as T;
    }

    public static async transaction<T>(callback: CallableFunction): Promise<T> {
        return await new Promise(async (resolve, reject) => {
            await AppDataSource.transaction(async (entityManager: EntityManager) => {
                resolve(callback(entityManager))
            })
        })

    }
}