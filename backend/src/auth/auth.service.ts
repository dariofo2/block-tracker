import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/controllers/users/dto/create-user.dto';
import UsersRepository from 'src/database/repository/users/users.repository';
import RequestUserLoginDTO from './dto/request-user-login.dto';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import ResponseUserLoginDTO from './dto/reponse-user-login.dto';

@Injectable()
export class AuthService {
    constructor (
        private usersRepository: UsersRepository,
        private jwtService: JwtService
    ) {}

    async signin (createUserDTO: CreateUserDto) {
        createUserDTO.password=await hash(createUserDTO.password as string,10);
        const createdUser=await this.usersRepository.create(createUserDTO);
        createdUser.password=undefined;

        return createdUser;
    }

    async login (requestUserLoginDTO: RequestUserLoginDTO) : Promise<ResponseUserLoginDTO> {
        const user=await this.usersRepository.getByEmailOrFail(requestUserLoginDTO.email);
        const checkPassword=await compare(requestUserLoginDTO.password,user.password as string);

        if (!checkPassword) throw new BadRequestException("Invalid Password. Doesn't match.");
        
        //If Password is valid Create JWT Token and send By Cookie
        const responseUserLoginDTO= plainToInstance(ResponseUserLoginDTO,user);
        const payload= instanceToPlain(responseUserLoginDTO);
        const jwtToken=await this.jwtService.signAsync(payload);

        responseUserLoginDTO.jwtToken="Bearer " + jwtToken;

        return responseUserLoginDTO;
    }

    async logout () {
        
    }
}
