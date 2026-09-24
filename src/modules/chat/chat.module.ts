import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { Channel, Message, VoiceMessage, Reaction, User } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, Message, VoiceMessage, Reaction, User])],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService, ChatGateway],
})
export class ChatModule {}

