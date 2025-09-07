import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus, OrderType } from './entities/order.entity';
import { UsersService } from '../users/users.service';
import { StripeService } from '../stripe/stripe.service';
import { UserPlan } from '../users/entities/user.entity';

export interface CreateOrderDto {
  stripePaymentIntentId: string;
  stripeSessionId: string;
  userId: string;
  type: OrderType;
  amount: number;
  currency: string;
  plan?: string;
  addonType?: string;
  addonQuantity?: number;
  metadata?: Record<string, any>;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private usersService: UsersService,
    private stripeService: StripeService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.ordersRepository.create(createOrderDto);
    return this.ordersRepository.save(order);
  }

  async findAll(userId: string): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id, userId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findByStripeSessionId(sessionId: string): Promise<Order | null> {
    return this.ordersRepository.findOne({
      where: { stripeSessionId: sessionId },
    });
  }

  async findByStripePaymentIntentId(paymentIntentId: string): Promise<Order | null> {
    return this.ordersRepository.findOne({
      where: { stripePaymentIntentId: paymentIntentId },
    });
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = status;
    if (status === OrderStatus.COMPLETED) {
      order.markAsCompleted();
    } else if (status === OrderStatus.FAILED) {
      order.markAsFailed();
    } else if (status === OrderStatus.CANCELLED) {
      order.markAsCancelled();
    }

    return this.ordersRepository.save(order);
  }

  async processCompletedOrder(order: Order): Promise<void> {
    const user = await this.usersService.findOne(order.userId);

    if (order.type === OrderType.SUBSCRIPTION) {
      // Handle subscription order
      const plan = this.stripeService.getPlanFromPriceId(order.plan);
      if (plan) {
        await this.usersService.updatePlan(user.id, plan);
      }
    } else if (order.type === OrderType.ADDON) {
      // Handle addon order
      if (order.addonType === 'generations' && order.addonQuantity) {
        await this.usersService.addGenerations(user.id, order.addonQuantity);
      }
    }
  }

  async getOrderStats(userId: string): Promise<{
    total: number;
    completed: number;
    pending: number;
    failed: number;
    totalSpent: number;
  }> {
    const orders = await this.ordersRepository.find({
      where: { userId },
    });

    const stats = {
      total: orders.length,
      completed: orders.filter(o => o.status === OrderStatus.COMPLETED).length,
      pending: orders.filter(o => o.status === OrderStatus.PENDING).length,
      failed: orders.filter(o => o.status === OrderStatus.FAILED).length,
      totalSpent: orders
        .filter(o => o.status === OrderStatus.COMPLETED)
        .reduce((sum, order) => sum + parseFloat(order.amount.toString()), 0),
    };

    return stats;
  }

  async getRecentOrders(userId: string, limit: number = 10): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}

