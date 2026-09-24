import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { SocialPage } from './social-page.entity';
import { User } from './user.entity';
import { EventParticipation } from './event-participation.entity';

@Entity('events')
export class SocialEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titre: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp' })
  dateDebut: Date;

  @Column({ type: 'timestamp', nullable: true })
  dateFin: Date;

  @Column({ nullable: true })
  lieu: string;

  @Column({ nullable: true })
  lienMeet: string;

  @ManyToOne(() => SocialPage, (page) => page.events, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'page_id' })
  page: SocialPage;

  @Column({ name: 'page_id', nullable: true })
  pageId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organisateur_id' })
  organisateur: User;

  @Column({ name: 'organisateur_id' })
  organisateurId: string;

  @OneToMany(() => EventParticipation, (p) => p.event)
  participations: EventParticipation[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
