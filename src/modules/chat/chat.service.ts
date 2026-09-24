import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel, Message, VoiceMessage, Reaction, User } from '../../entities';
import { MessageType } from '../../common/enums';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Channel) private channelRepo: Repository<Channel>,
    @InjectRepository(Message) private messageRepo: Repository<Message>,
    @InjectRepository(VoiceMessage) private voiceRepo: Repository<VoiceMessage>,
    @InjectRepository(Reaction) private reactionRepo: Repository<Reaction>,
  ) {}

  async getMessages(channelId: string) {
    return this.messageRepo.find({
      where: { channelId },
      relations: {
        auteur: true,
        voiceMessage: true,
        reactions: { user: true },
        reponseA: { auteur: true },
      },
      order: { createdAt: 'ASC' },
    });
  }

  async sendMessage(params: {
    channelId: string;
    auteurId: string;
    type?: MessageType;
    contenu?: string;
    fichierUrl?: string;
    reponseAId?: string;
    voiceData?: {
      fichierAudioUrl: string;
      dureeSecondes: number;
      tailleOctets?: number;
      formeOnde?: string;
      transcription?: string;
    };
  }) {
    const message = this.messageRepo.create({
      channelId: params.channelId,
      auteurId: params.auteurId,
      type: params.type || MessageType.TEXTE,
      contenu: params.contenu,
      fichierUrl: params.fichierUrl,
      reponseAId: params.reponseAId,
    });

    const savedMessage = await this.messageRepo.save(message);

    if (params.type === MessageType.VOCAL && params.voiceData) {
      await this.voiceRepo.save(
        this.voiceRepo.create({
          messageId: savedMessage.id,
          fichierAudioUrl: params.voiceData.fichierAudioUrl,
          dureeSecondes: params.voiceData.dureeSecondes,
          tailleOctets: params.voiceData.tailleOctets || 0,
          formeOnde: params.voiceData.formeOnde || JSON.stringify([5, 12, 25, 40, 30, 20, 10]),
          transcription: params.voiceData.transcription,
        }),
      );
    }

    return this.messageRepo.findOne({
      where: { id: savedMessage.id },
      relations: {
        auteur: true,
        voiceMessage: true,
        reactions: true,
        reponseA: true,
      },
    });
  }

  async toggleReaction(messageId: string, userId: string, emoji: string) {
    const existing = await this.reactionRepo.findOne({
      where: { messageId, userId, emoji },
    });
    if (existing) {
      await this.reactionRepo.remove(existing);
      return { action: 'removed' };
    } else {
      const reaction = this.reactionRepo.create({ messageId, userId, emoji });
      await this.reactionRepo.save(reaction);
      return { action: 'added', reaction };
    }
  }
}
