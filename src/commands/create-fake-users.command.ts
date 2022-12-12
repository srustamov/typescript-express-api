import {AppDataSource} from "../database/data-source";
import User from "../entity/User";
import { faker } from '@faker-js/faker';


(async () => {

    await AppDataSource.initialize()

    for (let i =0;i < 100;i++) {
        let user = new User();
        user.username = faker.name.fullName();
        user.password = "12345678";
        user.email = faker.internet.email()

        await user.save()
    }
})();

