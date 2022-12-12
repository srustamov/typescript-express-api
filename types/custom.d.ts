import User from "../src/entity/User";
import * as express from "express"

declare module 'custom' {
    export interface Request extends express.Request{
        user ?: User
    }
}
