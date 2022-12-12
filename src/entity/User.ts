import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    BeforeUpdate
} from "typeorm";
import {randomUUID} from "crypto";
import {base64Encode, randomToken} from "../utils/helpers";
import {Model} from "./Model";
import bcrypt from "bcrypt";


@Entity({
    name: 'users'
})
export default class User extends Model {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column({
        nullable: true
    })
    email: string

    @Column({
        nullable: false,
        select: false
    })
    password: string

    @Column({
        default: false
    })
    is_online: boolean

    @Column({
        default: 0
    })
    status: number

    @Column({
        unique: true
    })
    uuid: string

    @Column({
        unique: true,
        nullable: true
    })
    token: string

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;

    public async refreshToken(): Promise<User> {
        await this.generateToken();
        await this.save();
        return this;
    }

    public async generateToken(): Promise<User> {

        const token = await randomToken(48) as string;

        this.token = `${token}.${base64Encode(Date.now())}`;

        return this;
    }

    @BeforeUpdate()
    protected async updating() {
        if (!this.password.startsWith('$2b$10')) {
            this.password = await bcrypt.hash(this.password, 10)
        }
    }

    @BeforeInsert()
    protected async creating() {

        this.uuid = randomUUID();
        await this.generateToken()

        if (!this.password.startsWith('$2b$10')) {
            this.password = await bcrypt.hash(this.password, 10)
        }
    }
}