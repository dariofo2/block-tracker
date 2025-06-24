import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Web3Service } from './web3/web3.service';
import { Web3Module } from './web3/web3.module';

@Module({
  imports: [Web3Module],
  controllers: [AppController],
  providers: [AppService, Web3Service],
})
export class AppModule {}
