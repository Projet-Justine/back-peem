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
import { User } from './user.entity';
import { UE } from './ue.entity';
import { QAAnswer } from './qa-answer.entity';

@Entity('questions')
export class QAQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'auteur_id' })
  auteur: User;

  @Column({ name: 'auteur_id' })
  auteurId: string;

  @ManyToOne(() => UE, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'ue_id' })
  ue: UE;

  @Column({ name: 'ue_id', nullable: true })
  ueId: string;

  @Column()
  titre: string;

  @Column({ type: 'text' })
  contenu: string;

  @Column({ default: false })
  resolu: boolean;

  @Column({ nullable: true })
  solutionAnswerId: string;

  @OneToMany(() => QAAnswer, (ans) => ans.question)
  reponses: QAAnswer[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
