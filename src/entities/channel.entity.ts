import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ChannelType } from '../common/enums';
import { Group } from './group.entity';
import { Message } from './message.entity';

@Entity('channels')
export class Channel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column({
    type: 'enum',
    enum: ChannelType,
    default: ChannelType.GROUPE,
  })
  type: ChannelType;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Group, (group) => group.channels, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'groupe_id' })
  group: Group;

  @Column({ name: 'groupe_id', nullable: true })
  groupeId: string;

  @OneToMany(() => Message, (message) => message.channel)
  messages: Message[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
