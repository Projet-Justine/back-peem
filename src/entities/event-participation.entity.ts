import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { SocialEvent } from './social-event.entity';
import { User } from './user.entity';

@Entity('event_participations')
@Unique(['eventId', 'userId'])
export class EventParticipation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => SocialEvent, (ev) => ev.participations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: SocialEvent;

  @Column({ name: 'event_id' })
  eventId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ default: 'INTERESSE' }) // INTERESSE, PARTICIPE, REFUSE
  statut: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
