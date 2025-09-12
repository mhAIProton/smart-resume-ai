import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserPlan, SubscriptionStatus } from './entities/user.entity';

export interface CreateUserDto {
  email: string;
  name: string;
  googleId?: string;
  avatar?: string;
  plan?: UserPlan;
}

export interface UpdateUserDto {
  name?: string;
  avatar?: string;
  plan?: UserPlan;
  remainingGenerations?: number;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create({
      ...createUserDto,
      plan: createUserDto.plan || UserPlan.FREE,
      remainingGenerations: 3,
      totalGenerations: 3,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
    });

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'email', 'name', 'avatar', 'plan', 'remainingGenerations', 'subscriptionStatus', 'createdAt'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { googleId } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async updatePlan(id: string, plan: UserPlan): Promise<User> {
    const user = await this.findOne(id);
    user.plan = plan;
    
    // Update generation limits based on plan
    const planLimits = user.getPlanLimits();
    user.remainingGenerations = planLimits.generations;
    
    return this.usersRepository.save(user);
  }

  async activateSubscription(id: string, plan: UserPlan): Promise<User> {
    const user = await this.findOne(id);
    user.plan = plan;
    user.subscriptionStatus = SubscriptionStatus.ACTIVE;
    
    // Set subscription expiry to 1 month from now
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    user.subscriptionExpiresAt = expiryDate;
    
    // Update generation limits based on plan
    const planLimits = user.getPlanLimits();
    user.remainingGenerations = planLimits.generations;
    user.totalGenerations = planLimits.generations;
    
    return this.usersRepository.save(user);
  }

  async addGenerations(id: string, count: number): Promise<User> {
    const user = await this.findOne(id);
    user.addGenerations(count);
    return this.usersRepository.save(user);
  }

  async decrementGenerations(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.decrementGenerations();
    return this.usersRepository.save(user);
  }

  async updateStripeInfo(id: string, customerId: string, subscriptionId?: string): Promise<User> {
    const user = await this.findOne(id);
    user.stripeCustomerId = customerId;
    if (subscriptionId) {
      user.stripeSubscriptionId = subscriptionId;
    }
    return this.usersRepository.save(user);
  }

  async setSubscriptionExpiry(id: string, expiresAt: Date): Promise<User> {
    const user = await this.findOne(id);
    user.subscriptionExpiresAt = expiresAt;
    return this.usersRepository.save(user);
  }

  async updateSubscriptionStatus(id: string, status: SubscriptionStatus): Promise<User> {
    const user = await this.findOne(id);
    user.subscriptionStatus = status;
    return this.usersRepository.save(user);
  }

  async setSubscriptionCanceling(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.subscriptionStatus = SubscriptionStatus.CANCELING;
    return this.usersRepository.save(user);
  }

  async setSubscriptionCanceled(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.subscriptionStatus = SubscriptionStatus.CANCELED;
    return this.usersRepository.save(user);
  }

  async setSubscriptionActive(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.subscriptionStatus = SubscriptionStatus.ACTIVE;
    return this.usersRepository.save(user);
  }
}

