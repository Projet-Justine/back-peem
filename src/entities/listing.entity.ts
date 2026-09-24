import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ListingCategory, ListingStatus } from '../common/enums';
import { User } from './user.entity';

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'auteur_id' })
  auteur: User;

  @Column({ name: 'auteur_id' })
  auteurId: string;

  @Column()
  titre: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: ListingCategory,
    default: ListingCategory.LIVRES,
  })
  categorie: ListingCategory;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  prix: number; // Prix en Ar / gratuit

  @Column({ nullable: true })
  contactInfo: string;

  @Column({ type: 'simple-array', nullable: true })
  photos: string[];

  @Column({
    type: 'enum',
    enum: ListingStatus,
    default: ListingStatus.ACTIF,
  })
  statut: ListingStatus;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
