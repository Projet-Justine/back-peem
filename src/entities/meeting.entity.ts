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
import { MeetingStatus } from '../common/enums';
import { User } from './user.entity';
import { Group } from './group.entity';
import { Participation } from './participation.entity';
import { Recording } from './recording.entity';

@Entity('meetings')
export class Meeting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titre: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'hote_id' })
  hote: User;

  @Column({ name: 'hote_id', nullable: true })
  hoteId: string;

  @ManyToOne(() => Group, (group) => group.meetings, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'groupe_id' })
  group: Group;

  @Column({ name: 'groupe_id', nullable: true })
  groupeId: string;

  @Column({ unique: true })
  salleCode: string;

  @Column({ type: 'timestamp', nullable: true })
  dateDebut: Date;

  @Column({ type: 'timestamp', nullable: true })
  dateFin: Date;

  @Column({
    type: 'enum',
    enum: MeetingStatus,
    default: MeetingStatus.PROGRAMMEE,
  })
  statut: MeetingStatus;

  @Column({ nullable: true })
  lien: string;

  @Column({ default: false })
  estEnregistree: boolean;

  @OneToMany(() => Participation, (p) => p.meeting)
  participations: Participation[];

  @OneToMany(() => Recording, (rec) => rec.meeting)
  recordings: Recording[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
