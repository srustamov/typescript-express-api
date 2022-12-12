import {JsonController, Get, Req} from "routing-controllers";
import {Controller} from "../../utils/controller";
import {Request} from "custom";

@JsonController('/', {transformResponse: true})
export default class extends Controller {

    @Get('')
    public async index(@Req() request: Request) {

        return {
            status: 200,
            success: true
        };
    }
}