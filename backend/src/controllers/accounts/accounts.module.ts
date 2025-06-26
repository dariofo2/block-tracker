import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { DBModule } from 'src/database/db.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DBModule, TransactionsModule,AuthModule],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}
