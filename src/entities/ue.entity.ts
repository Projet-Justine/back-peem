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
import { UEStatus } from '../common/enums';
import { User } from './user.entity';
import { MatiereEC } from './matiere-ec.entity';
import { Enrollment } from './enrollment.entity';
import { Evaluation } from './evaluation.entity';
import { ResultatUE } from './resultat-ue.entity';

@Entity('ue')
export class UE {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string; // Ex: INF201, MTH101

  @Column()
  intitule: string; // Ex: Algorithmique et Structures de Données

  @Column({ type: 'int', default: 4 })
  creditsEcts: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1 })
  coefficient: number;

  @Column({ type: 'int', default: 20 })
  volumeHoraireCm: number;

  @Column({ type: 'int', default: 20 })
  volumeHoraireTd: number;

  @Column({ type: 'int', default: 10 })
  volumeHoraireTp: number;

  @Column()
  semestre: string; // S1, S2, ..., S10

  @Column()
  filiere: string; // Informatique, Gestion, Télécom...

  @Column()
  niveau: string; // L1, L2, L3, M1, M2

  @Column({
    type: 'enum',
    enum: UEStatus,
    default: UEStatus.PUBLIEE,
  })
  statut: UEStatus;

  @Column({ type: 'text', nullable: true })
  programme: string;

  @Column({ type: 'text', nullable: true })
  objectifs: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'responsable_id' })
  responsable: User;

  @Column({ name: 'responsable_id', nullable: true })
  responsableId: string;

  @OneToMany(() => MatiereEC, (ec) => ec.ue, { cascade: true })
  elementsConstitutifs: MatiereEC[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.ue)
  inscriptions: Enrollment[];

  @OneToMany(() => Evaluation, (evaluation) => evaluation.ue)
  evaluations: Evaluation[];

  @OneToMany(() => ResultatUE, (res) => res.ue)
  resultats: ResultatUE[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
