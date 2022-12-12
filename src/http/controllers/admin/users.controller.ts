import {JsonController, Get, QueryParam, Param} from "routing-controllers";
import {Controller} from "../../../utils/controller";
import User from "../../../entity/User";
import {paginate} from "../../../utils/helpers";
import {Repository} from "typeorm";

@JsonController('/admin/users', {transformResponse: true})
export default class extends Controller {

    private repository: Repository<User> = this.getEntityManager().getRepository(User)

    @Get('/')
    public async index(
        @QueryParam('page', {required: true, validate: true}) page: number,
        @QueryParam('perPage', {required: true, validate: true}) perPage: number,
    ) {
        const builder = this.repository.createQueryBuilder();
        const paginateData = await paginate<User>(builder, page || 1, perPage || 15)

        return {
            status: true,
            ...paginateData
        };
    }

    @Get('/:id([0-9]+)')
    public async show(@Param('id') id: number) {

        const user = await this.repository.findOneByOrFail({id})

        return {
            status: true,
            data: user
        }
    }
}