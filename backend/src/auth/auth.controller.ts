import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/controllers/users/dto/create-user.dto';
import RequestUserLoginDTO from './dto/request-user-login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signin")
  async signin (@Body() createUserDTO: CreateUserDto) {
    return await this.authService.signin(createUserDTO);
  }

  @Post("login")
  async login (@Body() requestUserLoginDTO: RequestUserLoginDTO, @Res({passthrough:true}) res: Response) {
    const responseUserLoginDTO=await this.authService.login(requestUserLoginDTO);
    res.cookie("jwtToken", responseUserLoginDTO.jwtToken,{
      httpOnly: process.env.COOKIES_HTTP_ONLY=="true" ? true : false,
      secure: process.env.COOKIES_SECURE=="true" ? true : false
    })

    return responseUserLoginDTO;
  }

  @Post("logout") 
  async logout (@Res({passthrough:true}) res: Response) {
    res.clearCookie("jwtToken",{
      httpOnly: process.env.COOKIES_HTTP_ONLY=="true" ? true : false,
      secure: process.env.COOKIES_SECURE=="true" ? true : false
    })
  }

}
