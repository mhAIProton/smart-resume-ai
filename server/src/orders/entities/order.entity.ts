import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum OrderType {
  SUBSCRIPTION = 'subscription',
  ADDON = 'addon',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  stripePaymentIntentId: string;

  @Column()
  @Index()
  stripeSessionId: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: OrderType,
  })
  type: OrderType;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column({ nullable: true })
  plan?: string;

  @Column({ nullable: true })
  addonType?: string;

  @Column({ nullable: true })
  addonQuantity?: number;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Helper methods
  isCompleted(): boolean {
    return this.status === OrderStatus.COMPLETED;
  }

  isPending(): boolean {
    return this.status === OrderStatus.PENDING;
  }

  markAsCompleted(): void {
    this.status = OrderStatus.COMPLETED;
    this.completedAt = new Date();
  }

  markAsFailed(): void {
    this.status = OrderStatus.FAILED;
  }

  markAsCancelled(): void {
    this.status = OrderStatus.CANCELLED;
  }
}

