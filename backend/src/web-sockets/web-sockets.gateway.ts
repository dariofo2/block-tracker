import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsException } from '@nestjs/websockets';
import { WebSocketsService } from './web-sockets.service';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { BadRequestException } from '@nestjs/common';

@WebSocketGateway()
export class WebSocketsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly webSocketsService: WebSocketsService,
    private readonly authService: AuthService
  ) {}
  
  async afterInit(server: Server) {
    console.log("WebSockets Connection Succesfull");
  }

  async handleConnection(client: Socket, ...args: any[]) {
    //Get Header Cookie JWT
    const cookies=client.handshake.headers.cookie;
    const jwtToken=cookies?.split("jwtToken=")[1].split(";")[0].replace("%20"," ");

    //Try to Auth JWT. If Error Disconnect Client
    try {
    await this.authService.checkManualAuth(jwtToken as string);
    } catch (error) {
      console.error(error);
      client.emit("connection","Error on JWT Token Auth");
      client.disconnect();
    }
    
    //If OK emit message Success
    client.emit("connection","Connected Succesfully");
  }

  async handleDisconnect(client: Socket) {
    client.emit("connection","Disconnected Succesfully");
    client.disconnect();
  }
}
