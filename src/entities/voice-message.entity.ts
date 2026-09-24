import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Message } from './message.entity';

@Entity('voice_messages')
export class VoiceMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Message, (msg) => msg.voiceMessage, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'message_id' })
  message: Message;

  @Column({ name: 'message_id' })
  messageId: string;

  @Column()
  fichierAudioUrl: string;

  @Column({ type: 'int', default: 0 })
  dureeSecondes: number;

  @Column({ type: 'int', default: 0 })
  tailleOctets: number;

  @Column({ type: 'text', nullable: true })
  formeOnde: string; // Waveform data (JSON or array representation)

  @Column({ type: 'text', nullable: true })
  transcription: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
