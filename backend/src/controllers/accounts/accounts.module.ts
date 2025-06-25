import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { DBModule } from 'src/database/db.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [DBModule, TransactionsModule],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}
