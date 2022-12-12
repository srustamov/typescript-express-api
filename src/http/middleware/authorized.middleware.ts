import {Action} from "routing-controllers";
// import {AppDataSource} from "../../database/data-source";
// import User from "../../entity/User";


export async function authorizationChecker(action: Action, roles: string[]) {

    return true;
    /*
    let user = action.request?.user

    if(!user) {

        const token = action.request.headers['authorization'];

        if(token) {
            const user = await AppDataSource.getRepository(User).findOneBy({token});
        }
    }

    if (user && !roles.length) return true;

    return !!(user && roles.find(role => user.roles.indexOf(role) !== -1));

    */
}