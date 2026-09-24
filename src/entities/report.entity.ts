import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ReportStatus } from '../common/enums';
import { User } from './user.entity';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cibleType: string; // MESSAGE, POST, LISTING, USER

  @Column()
  cibleId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'auteur_id' })
  auteur: User;

  @Column({ name: 'auteur_id' })
  auteurId: string;

  @Column({ type: 'text' })
  motif: string;

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.EN_ATTENTE,
  })
  statut: ReportStatus;

  @Column({ type: 'text', nullable: true })
  resolution: string;

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
