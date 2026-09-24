import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Meeting } from './meeting.entity';

@Entity('recordings')
export class Recording {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Meeting, (m) => m.recordings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'meeting_id' })
  meeting: Meeting;

  @Column({ name: 'meeting_id' })
  meetingId: string;

  @Column()
  fichierUrl: string;

  @Column({ type: 'int', default: 0 })
  dureeSecondes: number;

  @Column({ type: 'bigint', default: 0 })
  tailleOctets: number;

  @Column({ default: 'GROUPE' })
  visibilite: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
