import { Module } from '@nestjs/common';
import { WebSocketsService } from './web-sockets.service';
import { WebSocketsGateway } from './web-sockets.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule
  ],
  providers: [WebSocketsGateway, WebSocketsService],
})
export class WebSocketsModule {}
