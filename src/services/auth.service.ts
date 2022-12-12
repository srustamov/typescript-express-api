import User from "../entity/User";
import {AppDataSource} from "../database/data-source";
import bcrypt from "bcrypt";
import {Request} from "custom";

export class AuthService {

    public static async login({email, password}): Promise<false | User> {
        const user: null | User = await AppDataSource.getRepository(User).findOne({
            where: {
                email: email,
            },
            select: {
                id: true,
                username: true,
                email: true,
                password: true,
                token: true,
                status: true,
                is_online: true
            }
        })

        if (!user) {
            return false;
        }

        const check: boolean = await bcrypt.compare(password, user.password);

        if (!check) {
            return false;
        }

        const data = await user.refreshToken()

        delete data.password;

        return data;
    }

    public static async logout(user: User): Promise<User> {
        return await user.refreshToken()
    }

    public static async register() {

    }

    public static async getUserFromRequest(request: Request): Promise<null | User> {

        if (request.user) {
            return request.user;
        }

        const header: string = request.header('authorization') as string;

        if (!header) return null;

        let token = header;

        if (header.startsWith('Bearer')) {

            const tokenParts = header.split(' ');

            if (tokenParts.length != 2) {
                return null;
            }

            token = tokenParts[1];
        }

        return await AuthService.findByToken(token);
    }

    public static async findByToken(token: string): Promise<null | User> {
        return await AppDataSource.getRepository(User).findOneBy({
            token: token
        })
    }

}