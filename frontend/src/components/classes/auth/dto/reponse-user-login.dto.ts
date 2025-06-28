import { Exclude } from "class-transformer";

export default class ResponseUserLoginDTO {
    id?: number;
    name?: string;
    surname?: string;
    email?: string;
    password?: string;
    role?: number;
    jwtToken?: string;
}