import {Body, UseBefore, JsonController, Post, Res, Req, Get} from "routing-controllers";
import {Controller} from "../../utils/controller";
import {AuthMiddleware} from "../middleware/auth.middleware";
import {Response} from "express";
import {Request} from "custom";
import {LoginRequest} from "../requests/login.request";
import {AuthService} from "../../services/auth.service";
import User from "../../entity/User";

@JsonController('/auth', {transformResponse: true})
export default class extends Controller {
    @Post('/login')
    public async login(@Body({validate: true}) request: LoginRequest, @Res() response: Response) {

        const user: false | User = await AuthService.login(request);

        if (!user) {
            return response.status(422).json({
                status: false,
                message: "Login or password invalid"
            })
        }

        return {
            status: true,
            data: {
                token: user.token,
                user: user
            }
        }
    }

    @Post('/logout')
    @UseBefore(AuthMiddleware)
    public async logout(@Req() request: Request, @Res() response: Response) {
        await AuthService.logout(request.user)

        return {
            status: true,
            message: "Logout successfully"
        }
    }


    @Get('/user')
    @UseBefore(AuthMiddleware)
    public async user(@Req() request: Request, @Res() response: Response) {
        return {
            status: true,
            data: request.user
        }
    }

    @Post('/register')
    @UseBefore(AuthMiddleware)
    public async register(@Req() request: Request, @Res() response: Response) {

    }
}