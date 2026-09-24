import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { UserRole } from '../common/enums';
import { Profile } from './profile.entity';
import { Badge } from './badge.entity';
import { GroupMember } from './group-member.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  matricule: string;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  motDePasse: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ETUDIANT,
  })
  role: UserRole;

  @Column({ nullable: true })
  filiere: string; // Ex: Informatique, Gestion, Électronique

  @Column({ nullable: true })
  niveau: string; // Ex: L1, L2, L3, M1, M2

  @Column({ nullable: true })
  promotion: string; // Ex: 2026

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ nullable: true })
  coverUrl: string;

  @Column({ default: true })
  actif: boolean;

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Profile;

  @OneToMany(() => Badge, (badge) => badge.user)
  badges: Badge[];

  @OneToMany(() => GroupMember, (member) => member.user)
  groupMemberships: GroupMember[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
