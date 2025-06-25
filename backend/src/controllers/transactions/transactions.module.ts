import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { DBModule } from 'src/database/db.module';
import { Web3Module } from 'src/web3/web3.module';
import { HttpModule } from '@nestjs/axios';
import AxiosModule from 'src/axios/axios.module';

@Module({
  imports: [DBModule,Web3Module,AxiosModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService]
})
export class TransactionsModule {}
