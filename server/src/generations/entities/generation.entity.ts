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

export enum GenerationType {
  RESUME = 'resume',
  COVER_LETTER = 'cover_letter',
}

export enum GenerationStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum ResumeDesign {
  CLASSIC = 'classic',
  MODERN = 'modern',
  MINIMALIST = 'minimalist',
}

export enum CoverLetterTone {
  FORMAL = 'formal',
  FRIENDLY = 'friendly',
  STRICT = 'strict',
}

@Entity('generations')
export class Generation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.generations)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: GenerationType,
  })
  type: GenerationType;

  @Column({
    type: 'enum',
    enum: GenerationStatus,
    default: GenerationStatus.PENDING,
  })
  status: GenerationStatus;

  @Column({ type: 'text' })
  jobDescription: string;

  @Column({ nullable: true })
  jobUrl?: string;

  @Column({ type: 'text', nullable: true })
  userExperience?: string;

  @Column({ type: 'text', nullable: true })
  existingResume?: string;

  @Column({
    type: 'enum',
    enum: CoverLetterTone,
    nullable: true,
  })
  tone?: CoverLetterTone;

  @Column({
    type: 'enum',
    enum: ResumeDesign,
    nullable: true,
  })
  design?: ResumeDesign;

  @Column({ type: 'text', nullable: true })
  generatedContent?: string;

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
    return this.status === GenerationStatus.COMPLETED;
  }

  isPending(): boolean {
    return this.status === GenerationStatus.PENDING;
  }

  isFailed(): boolean {
    return this.status === GenerationStatus.FAILED;
  }

  markAsCompleted(content: string): void {
    this.status = GenerationStatus.COMPLETED;
    this.generatedContent = content;
    this.completedAt = new Date();
  }

  markAsFailed(): void {
    this.status = GenerationStatus.FAILED;
  }
}

