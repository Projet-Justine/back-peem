import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity('post_targets')
export class PostTarget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Post, (post) => post.cibles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column({ name: 'post_id' })
  postId: string;

  @Column({ nullable: true })
  filiere: string; // Ex: Informatique, Gestion, ou NULL (tous)

  @Column({ nullable: true })
  niveau: string; // Ex: L1, L2, L3, M1, M2, ou NULL (tous)

  @Column({ nullable: true })
  classeId: string;

  @Column({ nullable: true })
  ueId: string;
}
