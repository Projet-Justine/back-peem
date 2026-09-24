import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { QAQuestion } from './qa-question.entity';
import { User } from './user.entity';

@Entity('answers')
export class QAAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => QAQuestion, (q) => q.reponses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: QAQuestion;

  @Column({ name: 'question_id' })
  questionId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'auteur_id' })
  auteur: User;

  @Column({ name: 'auteur_id' })
  auteurId: string;

  @Column({ type: 'text' })
  contenu: string;

  @Column({ default: false })
  estSolution: boolean;

  @Column({ default: 0 })
  votes: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
