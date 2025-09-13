import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Generation } from '../../generations/entities/generation.entity';

export enum UserPlan {
  FREE = 'free',
  PRO = 'pro',
  PRO_PLUS = 'pro_plus',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELING = 'canceling',
  CANCELED = 'canceled',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  googleId?: string;

  @Column({
    type: 'enum',
    enum: UserPlan,
    default: UserPlan.FREE,
  })
  plan: UserPlan;

  @Column({ default: 3 })
  remainingGenerations: number;

  @Column({ default: 3 })
  totalGenerations: number;

  @Column({ nullable: true })
  stripeCustomerId?: string;

  @Column({ nullable: true })
  stripeSubscriptionId?: string;

  @Column({ type: 'timestamp', nullable: true })
  subscriptionExpiresAt?: Date;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  subscriptionStatus: SubscriptionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Generation, (generation) => generation.user)
  generations: Generation[];

  // Helper methods
  canGenerate(): boolean {
    return this.remainingGenerations > 0;
  }

  decrementGenerations(): void {
    if (this.remainingGenerations > 0) {
      this.remainingGenerations--;
    }
  }

  addGenerations(count: number): void {
    this.remainingGenerations += count;
  }

  isSubscriptionActive(): boolean {
    if (!this.subscriptionExpiresAt) return false;
    return this.subscriptionExpiresAt > new Date();
  }

  getPlanLimits(): { generations: number; features: string[] } {
    switch (this.plan) {
      case UserPlan.FREE:
        return {
          generations: 3,
          features: ['Basic resume generation', 'Basic cover letter generation']
        };
      case UserPlan.PRO:
        return {
          generations: 30,
          features: ['Advanced resume generation', 'Advanced cover letter generation', 'Multiple designs', 'Priority support']
        };
      case UserPlan.PRO_PLUS:
        return {
          generations: 80,
          features: ['Premium resume generation', 'Premium cover letter generation', 'All designs', 'Priority support', 'Custom templates']
        };
      default:
        return {
          generations: 3,
          features: ['Basic resume generation', 'Basic cover letter generation']
        };
    }
  }
}

