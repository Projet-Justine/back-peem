import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { extractUserId } from '../../common/auth-helper';

@ApiTags('chat')
@Controller('api/v1/chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('channels/:channelId/messages')
  @ApiOperation({ summary: 'Historique des messages d un canal avec vocaux et réactions' })
  async getMessages(@Param('channelId') channelId: string) {
    return this.chatService.getMessages(channelId);
  }

  @Post('channels/:channelId/messages')
  @ApiOperation({ summary: 'Envoyer un message (texte, vocal, fichier)' })
  async sendMessage(
    @Param('channelId') channelId: string,
    @Body() body: any,
    @Req() req: any,
  ) {
    const auteurId = extractUserId(req, body.auteurId || body.userId);
    return this.chatService.sendMessage({
      channelId,
      ...body,
      auteurId,
    });
  }

  @Post('messages/:messageId/reaction')
  @ApiOperation({ summary: 'Ajouter ou retirer une réaction emoji' })
  async toggleReaction(
    @Param('messageId') messageId: string,
    @Body() body: { userId?: string; emoji: string },
    @Req() req: any,
  ) {
    const userId = extractUserId(req, body.userId);
    return this.chatService.toggleReaction(messageId, userId, body.emoji);
  }
}
