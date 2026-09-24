import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ClaimStatus } from '../common/enums';
import { Grade } from './grade.entity';
import { User } from './user.entity';

@Entity('reclamations')
export class Claim {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Grade, (grade) => grade.reclamations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'note_id' })
  grade: Grade;

  @Column({ name: 'note_id' })
  noteId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'etudiant_id' })
  etudiant: User;

  @Column({ name: 'etudiant_id' })
  etudiantId: string;

  @Column({ type: 'text' })
  motif: string;

  @Column({
    type: 'enum',
    enum: ClaimStatus,
    default: ClaimStatus.DEPOSEE,
  })
  statut: ClaimStatus;

  @Column({ type: 'text', nullable: true })
  reponse: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'traite_par_id' })
  traitePar: User;

  @Column({ name: 'traite_par_id', nullable: true })
  traiteParId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
