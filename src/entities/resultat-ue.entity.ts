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
import { DecisionUE } from '../common/enums';
import { UE } from './ue.entity';
import { User } from './user.entity';

@Entity('resultats_ue')
@Unique(['etudiantId', 'ueId', 'session'])
export class ResultatUE {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'etudiant_id' })
  etudiant: User;

  @Column({ name: 'etudiant_id' })
  etudiantId: string;

  @ManyToOne(() => UE, (ue) => ue.resultats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ue_id' })
  ue: UE;

  @Column({ name: 'ue_id' })
  ueId: string;

  @Column({ type: 'decimal', precision: 4, scale: 2, default: 0 })
  moyenne: number;

  @Column({ type: 'int', default: 0 })
  creditsObtenus: number;

  @Column({
    type: 'enum',
    enum: DecisionUE,
    default: DecisionUE.AJOURNE,
  })
  decision: DecisionUE;

  @Column({ default: 'NORMALE' }) // NORMALE, RATTRAPAGE
  session: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
