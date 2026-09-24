import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { UE } from './ue.entity';

@Entity('resources')
export class SharedResource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titre: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  fichierUrl: string;

  @ManyToOne(() => UE, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ue_id' })
  ue: UE;

  @Column({ name: 'ue_id' })
  ueId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'auteur_id' })
  auteur: User;

  @Column({ name: 'auteur_id' })
  auteurId: string;

  @Column({ default: 'RESUME' }) // RESUME, FICHE, EXERCICE_CORRIGE
  type: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 5.0 })
  noteMoyenne: number;

  @Column({ default: false })
  valideParEnseignant: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
