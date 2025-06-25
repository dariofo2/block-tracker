import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Web3Service } from './web3/web3.service';
import { Web3Module } from './web3/web3.module';
import { ConfigModule } from '@nestjs/config';
import { DBModule } from './database/db.module';
import { AccountsModule } from './controllers/accounts/accounts.module';
import { TransactionsModule } from './controllers/transactions/transactions.module';
import BullMQModule from './bullMQ/bullMQ.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    Web3Module,
    DBModule,
    BullMQModule,
    AccountsModule,
    TransactionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
