import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Web3Service } from './web3/web3.service';
import { Web3Module } from './web3/web3.module';
import { ConfigModule } from '@nestjs/config';
import { DBModule } from './database/db.module';
import { AccountsModule } from './controllers/accounts/accounts.module';
import { TransactionsModule } from './controllers/transactions/transactions.module';
import { AuthModule } from './auth/auth.module';
import { WebSocketsModule } from './web-sockets/web-sockets.module';
import BullMQModule from './bullMQ/bullMQ.module';
import AxiosModule from './axios/axios.module';
import { UsersModule } from './controllers/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    Web3Module,
    DBModule,
    BullMQModule,
    AxiosModule,
    WebSocketsModule,
    AccountsModule,
    TransactionsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
