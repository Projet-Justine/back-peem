import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Grade } from './grade.entity';
import { User } from './user.entity';

@Entity('historique_notes')
export class GradeHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Grade, (grade) => grade.historique, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'note_id' })
  grade: Grade;

  @Column({ name: 'note_id' })
  noteId: string;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  ancienneValeur: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  nouvelleValeur: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'modifie_par_id' })
  modifiePar: User;

  @Column({ name: 'modifie_par_id', nullable: true })
  modifieParId: string;

  @Column({ type: 'text', nullable: true })
  motif: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
