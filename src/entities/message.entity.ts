import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { MessageType } from '../common/enums';
import { Channel } from './channel.entity';
import { User } from './user.entity';
import { VoiceMessage } from './voice-message.entity';
import { Reaction } from './reaction.entity';

@Entity('messages')
@Index(['channelId', 'createdAt'])
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Channel, (channel) => channel.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'channel_id' })
  channel: Channel;

  @Column({ name: 'channel_id' })
  channelId: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'auteur_id' })
  auteur: User;

  @Column({ name: 'auteur_id', nullable: true })
  auteurId: string;

  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.TEXTE,
  })
  type: MessageType;

  @Column({ type: 'text', nullable: true })
  contenu: string;

  @Column({ nullable: true })
  fichierUrl: string;

  @ManyToOne(() => Message, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'reponse_a_id' })
  reponseA: Message;

  @Column({ name: 'reponse_a_id', nullable: true })
  reponseAId: string;

  @Column({ default: false })
  modifie: boolean;

  @Column({ default: false })
  epingle: boolean;

  @OneToOne(() => VoiceMessage, (voice) => voice.message, { cascade: true, nullable: true })
  voiceMessage: VoiceMessage;

  @OneToMany(() => Reaction, (reaction) => reaction.message)
  reactions: Reaction[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
