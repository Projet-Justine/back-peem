import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PostAudience } from '../common/enums';
import { User } from './user.entity';

@Entity('wall_posts')
export class WallPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'auteur_id' })
  auteur: User;

  @Column({ name: 'auteur_id' })
  auteurId: string;

  @Column({ type: 'text' })
  contenu: string;

  @Column({ type: 'simple-array', nullable: true })
  medias: string[];

  @Column({
    type: 'enum',
    enum: PostAudience,
    default: PostAudience.AMIS,
  })
  audience: PostAudience;

  @Column({ default: false })
  epingle: boolean;

  @Column({ default: 0 })
  likesCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
