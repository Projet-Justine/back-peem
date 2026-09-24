import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column()
  action: string; // Ex: VALIDATION_NOTES, PUBLICATION_NOTES, MODIFICATION_NOTE, CONNEXION, BAN_USER

  @Column({ nullable: true })
  cibleType: string;

  @Column({ nullable: true })
  cibleId: string;

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column({ nullable: true })
  ipAddress: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
