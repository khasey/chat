import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './chat.entity';
import { Channel } from 'diagnostics_channel';
import { UserService } from '../user/user.service';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'],
    credentials: true,
  }
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private userService: UserService,
  ) {}
  handleDisconnect(client: Socket) {
    // Logique de déconnexion
  console.log(`Client ${client.id} disconnected ChatGateway.`);
  // Autres actions à effectuer lors de la déconnexion

  // Éventuellement, émettre un événement pour informer les autres clients de la déconnexion
  this.server.emit('user disconnected', client.id);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client ${client.id} connected ChatGateway.  from ${client}`);
    // console.log(client.request); // Afficher l'objet request entier
    const messages = await this.messageRepository.find();
    client.emit('chat complet', messages);
  }

  @SubscribeMessage('chat message')
  async handleMessage(@MessageBody() message: { text: string; user: User; channelId: number; }): Promise<void> {
    const userfrom = await this.userService.getUserById(104440); 
    const blockedUsers = await this.userService.getBlockedUsers(userfrom.id);

    if (blockedUsers.includes(message.user.id)) {
      console.log(`Message from blocked user ${message.user.username}. Ignoring.`);
      return;
    }

    const newMessage = new Message();
    newMessage.sender = message.user.id;
    newMessage.message = message.text;
    newMessage.date = new Date();
    newMessage.channelId = message.channelId;
    newMessage.user = message.user;
    newMessage.username = message.user.username;
    newMessage.imageUrl = message.user.imageUrl;
  

    console.log(`message from user ${message.user.username} => ${message.text}`);

    await this.messageRepository.save(newMessage);

    this.server.emit('chat message', newMessage);
    console.log('user => ', newMessage);
  }
}