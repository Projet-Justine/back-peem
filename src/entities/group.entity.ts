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
import { GroupType, AdhesionMode } from '../common/enums';
import { User } from './user.entity';
import { GroupMember } from './group-member.entity';
import { Channel } from './channel.entity';
import { Folder } from './folder.entity';
import { Meeting } from './meeting.entity';
import { Assignment } from './assignment.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: GroupType,
    default: GroupType.PROJET,
  })
  type: GroupType;

  @Column({
    type: 'enum',
    enum: AdhesionMode,
    default: AdhesionMode.INVITATION,
  })
  modeAdhesion: AdhesionMode;

  @Column({ nullable: true })
  codeInvitation: string;

  @Column({ type: 'timestamp', nullable: true })
  inviteCodeExpiresAt: Date;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'proprietaire_id' })
  proprietaire: User;

  @Column({ name: 'proprietaire_id', nullable: true })
  proprietaireId: string;

  @Column({ default: false })
  archive: boolean;

  @Column({ type: 'int', default: 500 }) // 500 MB default
  quotaStockageMo: number;

  @Column({ nullable: true })
  filiere: string; // Pour les classes officielles

  @Column({ nullable: true })
  niveau: string; // Pour les classes officielles

  @OneToMany(() => GroupMember, (member) => member.group)
  members: GroupMember[];

  @OneToMany(() => Channel, (channel) => channel.group)
  channels: Channel[];

  @OneToMany(() => Folder, (folder) => folder.group)
  folders: Folder[];

  @OneToMany(() => Meeting, (meeting) => meeting.group)
  meetings: Meeting[];

  @OneToMany(() => Assignment, (assignment) => assignment.group)
  assignments: Assignment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
