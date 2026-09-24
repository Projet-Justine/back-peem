import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Assignment } from './assignment.entity';
import { User } from './user.entity';

@Entity('remises')
@Unique(['assignmentId', 'etudiantId'])
export class AssignmentSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Assignment, (a) => a.remises, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assignment_id' })
  assignment: Assignment;

  @Column({ name: 'assignment_id' })
  assignmentId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'etudiant_id' })
  etudiant: User;

  @Column({ name: 'etudiant_id' })
  etudiantId: string;

  @Column({ nullable: true })
  fichierUrl: string;

  @Column({ type: 'text', nullable: true })
  commentaireEtudiant: string;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  note: number;

  @Column({ type: 'text', nullable: true })
  remarqueEnseignant: string;

  @CreateDateColumn({ name: 'date_remise' })
  dateRemise: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
