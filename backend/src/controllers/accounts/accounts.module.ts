import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { DBModule } from 'src/database/db.module';

@Module({
  imports: [DBModule],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}
