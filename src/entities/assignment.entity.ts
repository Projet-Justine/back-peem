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
import { AssignmentSubmission } from './assignment-submission.entity';

@Entity('devoirs')
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Group, (g) => g.assignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'groupe_id' })
  group: Group;

  @Column({ name: 'groupe_id' })
  groupeId: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'auteur_id' })
  auteur: User;

  @Column({ name: 'auteur_id', nullable: true })
  auteurId: string;

  @Column()
  titre: string;

  @Column({ type: 'text' })
  consigne: string;

  @Column({ type: 'timestamp', nullable: true })
  dateLimite: Date;

  @OneToMany(() => AssignmentSubmission, (sub) => sub.assignment)
  remises: AssignmentSubmission[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
