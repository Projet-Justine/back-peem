import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  type: string; // AMI, MESSAGE, NOTE_PUBLIEE, DEVOIR, ANNONCE

  @Column()
  titre: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ nullable: true })
  lien: string;

  @Column({ default: false })
  lu: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
