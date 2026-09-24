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
import { Group } from './group.entity';
import { User } from './user.entity';
import { FileItem } from './file-item.entity';

@Entity('folders')
export class Folder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @ManyToOne(() => Group, (group) => group.folders, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'groupe_id' })
  group: Group;

  @Column({ name: 'groupe_id', nullable: true })
  groupeId: string;

  @ManyToOne(() => Folder, (folder) => folder.children, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Folder;

  @Column({ name: 'parent_id', nullable: true })
  parentId: string;

  @OneToMany(() => Folder, (folder) => folder.parent)
  children: Folder[];

  @OneToMany(() => FileItem, (file) => file.folder)
  files: FileItem[];

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'proprietaire_id' })
  proprietaire: User;

  @Column({ name: 'proprietaire_id', nullable: true })
  proprietaireId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
