import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { SocialEvent } from './social-event.entity';

@Entity('pages')
export class SocialPage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'CLUB' }) // CLUB, ASSOCIATION, DEPARTEMENT
  type: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'responsable_id' })
  responsable: User;

  @Column({ name: 'responsable_id', nullable: true })
  responsableId: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  coverUrl: string;

  @Column({ default: false })
  verifie: boolean;

  @OneToMany(() => SocialEvent, (ev) => ev.page)
  events: SocialEvent[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
