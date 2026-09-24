import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connecté : ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client déconnecté : ${client.id}`);
  }

  @SubscribeMessage('channel:join')
  handleJoinChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() channelId: string,
  ) {
    client.join(`channel:${channelId}`);
    return { status: 'joined', channelId };
  }

  @SubscribeMessage('channel:leave')
  handleLeaveChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() channelId: string,
  ) {
    client.leave(`channel:${channelId}`);
    return { status: 'left', channelId };
  }

  @SubscribeMessage('message:send')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    const savedMessage = await this.chatService.sendMessage(payload);
    // Broadcast to everyone in channel
    this.server.to(`channel:${payload.channelId}`).emit('message:new', savedMessage);
    // Also emit globally for any general listener
    this.server.emit('message:new', savedMessage);
    return savedMessage;
  }

  @SubscribeMessage('typing:start')
  handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string; user: any },
  ) {
    client.to(`channel:${data.channelId}`).emit('typing:start', data);
  }

  @SubscribeMessage('typing:stop')
  handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string; user: any },
  ) {
    client.to(`channel:${data.channelId}`).emit('typing:stop', data);
  }
}
