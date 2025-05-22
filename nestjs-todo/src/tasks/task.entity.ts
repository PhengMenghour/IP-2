import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, DeleteDateColumn } from 'typeorm';
import { User } from '../users/user.entity';


@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true })
  completedAt: Date | null;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => User, user => user.tasks, { onDelete: 'CASCADE' })
  user: User;
}