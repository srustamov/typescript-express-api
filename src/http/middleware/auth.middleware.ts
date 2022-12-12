import {ExpressMiddlewareInterface} from 'routing-controllers';
import User from "../../entity/User";
import {Response} from "express";
import {Request} from 'custom'
import {AuthService} from "../../services/auth.service";

export class AuthMiddleware implements ExpressMiddlewareInterface {

    async use(request: Request, response: Response, next?: (err?: any) => any) {

        const user: null | User = await AuthService.getUserFromRequest(request)

        if (!user) {
            return response.status(401).json({
                status: false,
                message: "Unauthenticated"
            })
        }

        request.user = user;

        next();
    }
}