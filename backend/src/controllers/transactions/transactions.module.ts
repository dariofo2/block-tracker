import { forwardRef, Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { DBModule } from 'src/database/db.module';
import { Web3Module } from 'src/web3/web3.module';
import { HttpModule } from '@nestjs/axios';
import AxiosModule from 'src/axios/axios.module';
import { AuthModule } from 'src/auth/auth.module';
import BullMQModule from 'src/bullMQ/bullMQ.module';
import { WebSocketsModule } from 'src/web-sockets/web-sockets.module';

@Module({
  imports: [DBModule,Web3Module,WebSocketsModule, AxiosModule,AuthModule,forwardRef(()=>BullMQModule)],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService]
})
export class TransactionsModule {}
