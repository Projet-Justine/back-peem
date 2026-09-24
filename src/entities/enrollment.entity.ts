import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { UE } from './ue.entity';
import { User } from './user.entity';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'etudiant_id' })
  etudiant: User;

  @Column({ name: 'etudiant_id' })
  etudiantId: string;

  @ManyToOne(() => UE, (ue) => ue.inscriptions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ue_id' })
  ue: UE;

  @Column({ name: 'ue_id' })
  ueId: string;

  @Column({ default: '2025-2026' })
  anneeUniversitaire: string;

  @Column({ default: 'INSCRIT' }) // INSCRIT, VALIDE, AJOURNE
  statut: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
