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
import { PostType, PostStatus } from '../common/enums';
import { User } from './user.entity';
import { PostTarget } from './post-target.entity';
import { PostComment } from './post-comment.entity';
import { PostLike } from './post-like.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'auteur_id' })
  auteur: User;

  @Column({ name: 'auteur_id' })
  auteurId: string;

  @Column({
    type: 'enum',
    enum: PostType,
    default: PostType.INFORMATION,
  })
  type: PostType;

  @Column()
  titre: string;

  @Column({ type: 'text' })
  contenu: string;

  @Column({ type: 'simple-array', nullable: true })
  medias: string[];

  @Column({ default: false })
  epingle: boolean;

  @Column({ default: true })
  commentairesActifs: boolean;

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.PUBLIE,
  })
  statut: PostStatus;

  @Column({ type: 'timestamp', nullable: true })
  datePublication: Date;

  @Column({ type: 'timestamp', nullable: true })
  dateExpiration: Date;

  @Column({ default: 0 })
  vuesCount: number;

  @OneToMany(() => PostTarget, (target) => target.post, { cascade: true })
  cibles: PostTarget[];

  @OneToMany(() => PostComment, (comment) => comment.post)
  commentaires: PostComment[];

  @OneToMany(() => PostLike, (like) => like.post)
  reactions: PostLike[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
