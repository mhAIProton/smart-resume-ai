import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Generation, GenerationType, GenerationStatus, CoverLetterTone, ResumeDesign } from './entities/generation.entity';
import { UsersService } from '../users/users.service';
import { OpenaiService } from '../openai/openai.service';

export interface CreateGenerationDto {
  type: GenerationType;
  jobDescription: string;
  jobUrl?: string;
  userExperience?: string;
  existingResume?: string;
  tone?: CoverLetterTone;
  design?: ResumeDesign;
}

@Injectable()
export class GenerationsService {
  constructor(
    @InjectRepository(Generation)
    private generationsRepository: Repository<Generation>,
    private usersService: UsersService,
    private openaiService: OpenaiService,
  ) {}

  async create(userId: string, createGenerationDto: CreateGenerationDto): Promise<Generation> {
    const user = await this.usersService.findOne(userId);
    
    if (!user.canGenerate()) {
      throw new ForbiddenException('Insufficient generations remaining. Please upgrade your plan or purchase additional generations.');
    }

    const generation = this.generationsRepository.create({
      ...createGenerationDto,
      userId,
      status: GenerationStatus.PENDING,
    });

    const savedGeneration = await this.generationsRepository.save(generation);

    // Generate content asynchronously
    this.generateContent(savedGeneration.id);

    return savedGeneration;
  }

  async findAll(userId: string): Promise<Generation[]> {
    return this.generationsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Generation> {
    const generation = await this.generationsRepository.findOne({
      where: { id, userId },
    });

    if (!generation) {
      throw new BadRequestException('Generation not found');
    }

    return generation;
  }

  async remove(id: string, userId: string): Promise<void> {
    const generation = await this.findOne(id, userId);
    await this.generationsRepository.remove(generation);
  }

  private async generateContent(generationId: string): Promise<void> {
    try {
      const generation = await this.generationsRepository.findOne({
        where: { id: generationId },
        relations: ['user'],
      });

      if (!generation) {
        throw new Error('Generation not found');
      }

      let content: string;

      if (generation.type === GenerationType.RESUME) {
        content = await this.openaiService.generateResume({
          jobDescription: generation.jobDescription,
          userExperience: generation.userExperience,
          existingResume: generation.existingResume,
          design: generation.design,
        });
      } else {
        content = await this.openaiService.generateCoverLetter({
          jobDescription: generation.jobDescription,
          tone: generation.tone,
        });
      }

      // Update generation with content
      generation.markAsCompleted(content);
      await this.generationsRepository.save(generation);

      // Decrement user's remaining generations
      await this.usersService.decrementGenerations(generation.userId);

    } catch (error) {
      console.error('Generation error:', error);
      
      // Mark generation as failed
      const generation = await this.generationsRepository.findOne({
        where: { id: generationId },
      });
      
      if (generation) {
        generation.markAsFailed();
        await this.generationsRepository.save(generation);
      }
    }
  }

  async regenerate(id: string, userId: string): Promise<Generation> {
    const generation = await this.findOne(id, userId);
    
    if (generation.status !== GenerationStatus.COMPLETED) {
      throw new BadRequestException('Can only regenerate completed generations');
    }

    const user = await this.usersService.findOne(userId);
    if (!user.canGenerate()) {
      throw new ForbiddenException('Insufficient generations remaining');
    }

    // Reset generation status
    generation.status = GenerationStatus.PENDING;
    generation.generatedContent = null;
    generation.completedAt = null;
    
    const updatedGeneration = await this.generationsRepository.save(generation);

    // Generate new content
    this.generateContent(updatedGeneration.id);

    return updatedGeneration;
  }

  async getGenerationStats(userId: string): Promise<{
    total: number;
    completed: number;
    pending: number;
    failed: number;
    byType: Record<GenerationType, number>;
  }> {
    const generations = await this.generationsRepository.find({
      where: { userId },
    });

    const stats = {
      total: generations.length,
      completed: generations.filter(g => g.status === GenerationStatus.COMPLETED).length,
      pending: generations.filter(g => g.status === GenerationStatus.PENDING).length,
      failed: generations.filter(g => g.status === GenerationStatus.FAILED).length,
      byType: {
        [GenerationType.RESUME]: generations.filter(g => g.type === GenerationType.RESUME).length,
        [GenerationType.COVER_LETTER]: generations.filter(g => g.type === GenerationType.COVER_LETTER).length,
      },
    };

    return stats;
  }
}

