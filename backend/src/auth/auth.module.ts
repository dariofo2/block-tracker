import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { DBModule } from 'src/database/db.module';

@Module({
  imports: [
    DBModule,
    JwtModule.registerAsync({
      useFactory: ()=>({
        global:true,
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRATION_TIME
        }
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, AuthGuard],
  exports: [AuthService, JwtService, AuthGuard]
})
export class AuthModule { }
