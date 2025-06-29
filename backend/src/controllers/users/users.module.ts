import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DBModule } from 'src/database/db.module';

@Module({
  imports: [
    DBModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
