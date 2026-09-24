import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Folder } from './folder.entity';
import { Group } from './group.entity';
import { User } from './user.entity';

@Entity('files')
export class FileItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column({ nullable: true })
  cheminStockage: string;

  @Column({ nullable: true })
  url: string;

  @Column({ type: 'bigint', default: 0 })
  tailleOctets: number;

  @Column({ nullable: true })
  typeMime: string;

  @ManyToOne(() => Folder, (folder) => folder.files, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'dossier_id' })
  folder: Folder;

  @Column({ name: 'dossier_id', nullable: true })
  dossierId: string;

  @ManyToOne(() => Group, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'groupe_id' })
  group: Group;

  @Column({ name: 'groupe_id', nullable: true })
  groupeId: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'proprietaire_id' })
  proprietaire: User;

  @Column({ name: 'proprietaire_id', nullable: true })
  proprietaireId: string;

  @Column({ default: 1 })
  version: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
