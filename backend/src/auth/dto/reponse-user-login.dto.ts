import { Exclude } from "class-transformer";

export default class ResponseUserLoginDTO {
    id: number;
    name: string;
    surname: string;
    email: string;
    @Exclude()
    password: string;
    role: number;
    jwtToken: string;
}