import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { RelationType, RelationStatus } from '../common/enums';
import { User } from './user.entity';

@Entity('relations')
@Unique(['userAId', 'userBId'])
export class Friendship {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_a_id' })
  userA: User;

  @Column({ name: 'user_a_id' })
  userAId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_b_id' })
  userB: User;

  @Column({ name: 'user_b_id' })
  userBId: string;

  @Column({
    type: 'enum',
    enum: RelationType,
    default: RelationType.AMI,
  })
  type: RelationType;

  @Column({
    type: 'enum',
    enum: RelationStatus,
    default: RelationStatus.EN_ATTENTE,
  })
  statut: RelationStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
