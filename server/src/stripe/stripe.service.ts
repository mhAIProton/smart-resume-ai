import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { UserPlan } from '../users/entities/user.entity';

export interface CreateCheckoutSessionDto {
  priceId: string;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CreateAddonSessionDto {
  addonType: 'generations';
  quantity: number;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
}

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });
  }

  async createCheckoutSession(dto: CreateCheckoutSessionDto): Promise<Stripe.Checkout.Session> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: dto.priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        customer_email: dto.userEmail,
        metadata: {
          userId: dto.userId,
          type: 'subscription',
        },
        success_url: dto.successUrl,
        cancel_url: dto.cancelUrl,
        subscription_data: {
          metadata: {
            userId: dto.userId,
          },
        },
      });

      return session;
    } catch (error) {
      console.error('Stripe checkout session creation error:', error);
      throw new BadRequestException('Failed to create checkout session');
    }
  }

  async createAddonSession(dto: CreateAddonSessionDto): Promise<Stripe.Checkout.Session> {
    try {
      const pricePerGeneration = 0.50; // $0.50 per generation
      const totalAmount = dto.quantity * pricePerGeneration;

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${dto.quantity} Additional Generations`,
                description: `Add ${dto.quantity} generations to your account`,
              },
              unit_amount: Math.round(totalAmount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        customer_email: dto.userEmail,
        metadata: {
          userId: dto.userId,
          type: 'addon',
          addonType: dto.addonType,
          quantity: dto.quantity.toString(),
        },
        success_url: dto.successUrl,
        cancel_url: dto.cancelUrl,
      });

      return session;
    } catch (error) {
      console.error('Stripe addon session creation error:', error);
      throw new BadRequestException('Failed to create addon session');
    }
  }

  async createCustomer(email: string, name?: string): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
      });

      return customer;
    } catch (error) {
      console.error('Stripe customer creation error:', error);
      throw new BadRequestException('Failed to create customer');
    }
  }

  async getCustomer(customerId: string): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.retrieve(customerId) as Stripe.Customer;
      return customer;
    } catch (error) {
      console.error('Stripe customer retrieval error:', error);
      throw new BadRequestException('Failed to retrieve customer');
    }
  }

  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      return subscription;
    } catch (error) {
      console.error('Stripe subscription retrieval error:', error);
      throw new BadRequestException('Failed to retrieve subscription');
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.cancel(subscriptionId);
      return subscription;
    } catch (error) {
      console.error('Stripe subscription cancellation error:', error);
      throw new BadRequestException('Failed to cancel subscription');
    }
  }

  async getPrices(): Promise<Stripe.Price[]> {
    try {
      const prices = await this.stripe.prices.list({
        active: true,
        expand: ['data.product'],
      });

      return prices.data;
    } catch (error) {
      console.error('Stripe prices retrieval error:', error);
      throw new BadRequestException('Failed to retrieve prices');
    }
  }

  async constructWebhookEvent(payload: string, signature: string): Promise<Stripe.Event> {
    try {
      const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
      const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      return event;
    } catch (error) {
      console.error('Stripe webhook verification error:', error);
      throw new BadRequestException('Invalid webhook signature');
    }
  }

  getPlanFromPriceId(priceId: string): UserPlan | null {
    // Map Stripe price IDs to user plans
    const priceToPlanMap = {
      [this.configService.get<string>('STRIPE_PRO_PRICE_ID')]: UserPlan.PRO,
      [this.configService.get<string>('STRIPE_PRO_PLUS_PRICE_ID')]: UserPlan.PRO_PLUS,
    };

    return priceToPlanMap[priceId] || null;
  }

  getAddonQuantityFromMetadata(metadata: Record<string, string>): number {
    return parseInt(metadata.quantity || '0', 10);
  }
}

