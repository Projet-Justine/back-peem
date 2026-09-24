import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
} from 'typeorm';
import { PresenceStatus, GradePublicationStatus } from '../common/enums';
import { Evaluation } from './evaluation.entity';
import { User } from './user.entity';
import { GradeHistory } from './grade-history.entity';
import { Claim } from './claim.entity';

@Entity('grades')
@Unique(['evaluationId', 'etudiantId'])
export class Grade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Evaluation, (ev) => ev.grades, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'evaluation_id' })
  evaluation: Evaluation;

  @Column({ name: 'evaluation_id' })
  evaluationId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'etudiant_id' })
  etudiant: User;

  @Column({ name: 'etudiant_id' })
  etudiantId: string;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  valeur: number; // 0 à 20

  @Column({
    type: 'enum',
    enum: PresenceStatus,
    default: PresenceStatus.PRESENT,
  })
  statutPresence: PresenceStatus;

  @Column({
    type: 'enum',
    enum: GradePublicationStatus,
    default: GradePublicationStatus.BROUILLON,
  })
  statutPublication: GradePublicationStatus;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'saisie_par_id' })
  saisiePar: User;

  @Column({ name: 'saisie_par_id', nullable: true })
  saisieParId: string;

  @OneToMany(() => GradeHistory, (hist) => hist.grade)
  historique: GradeHistory[];

  @OneToMany(() => Claim, (claim) => claim.grade)
  reclamations: Claim[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
