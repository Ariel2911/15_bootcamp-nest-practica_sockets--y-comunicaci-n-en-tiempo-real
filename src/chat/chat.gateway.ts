import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway()
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  public server: Server;

  constructor(private readonly chatService: ChatService) {}

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      const { name } = socket.handshake.auth;
      console.log('New client connected', name);

      this.chatService.onClientConnected({ id: socket.id, name });

      this.server.emit('on-client-changed', this.chatService.getClient());

      socket.on('disconnect', () => {
        this.chatService.onClientDisconnected(socket.id);
        this.server.emit('on-client-changed', this.chatService.getClient());
        console.log('Cliente desconectado');
      });
    });
  }

  @SubscribeMessage('send-message')
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ) {
    const { name } = client.handshake.auth;

    if (!message) return;

    this.server.emit('on-message', { userId: client.id, name, message });
  }
}
