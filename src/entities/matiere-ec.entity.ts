import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { UE } from './ue.entity';
import { User } from './user.entity';
import { Evaluation } from './evaluation.entity';

@Entity('ec')
export class MatiereEC {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UE, (ue) => ue.elementsConstitutifs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ue_id' })
  ue: UE;

  @Column({ name: 'ue_id' })
  ueId: string;

  @Column()
  intitule: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1 })
  coefficient: number;

  @Column({ type: 'int', default: 20 })
  volumeHoraire: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'enseignant_id' })
  enseignant: User;

  @Column({ name: 'enseignant_id', nullable: true })
  enseignantId: string;

  @OneToMany(() => Evaluation, (ev) => ev.matiereEc)
  evaluations: Evaluation[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
