import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { DBModule } from 'src/database/db.module';
import { Web3Module } from 'src/web3/web3.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DBModule,Web3Module,HttpModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
