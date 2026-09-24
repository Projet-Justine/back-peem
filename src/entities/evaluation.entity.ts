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
import { EvaluationType } from '../common/enums';
import { UE } from './ue.entity';
import { MatiereEC } from './matiere-ec.entity';
import { Grade } from './grade.entity';

@Entity('evaluations')
export class Evaluation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titre: string;

  @ManyToOne(() => UE, (ue) => ue.evaluations, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'ue_id' })
  ue: UE;

  @Column({ name: 'ue_id', nullable: true })
  ueId: string;

  @ManyToOne(() => MatiereEC, (ec) => ec.evaluations, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'matiere_ec_id' })
  matiereEc: MatiereEC;

  @Column({ name: 'matiere_ec_id', nullable: true })
  matiereEcId: string;

  @Column({
    type: 'enum',
    enum: EvaluationType,
    default: EvaluationType.EXAMEN,
  })
  type: EvaluationType;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1 })
  ponderation: number; // Coefficient de l'évaluation

  @Column({ type: 'timestamp', nullable: true })
  dateEvaluation: Date;

  @Column({ default: 'NORMALE' }) // NORMALE, RATTRAPAGE
  session: string;

  @OneToMany(() => Grade, (grade) => grade.evaluation)
  grades: Grade[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
