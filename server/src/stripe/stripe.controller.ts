import { Controller, Post, Get, Body, Headers, RawBody, UseGuards, Req, Param, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StripeService, CreateCheckoutSessionDto, CreateAddonSessionDto } from './stripe.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User, UserPlan, SubscriptionStatus } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Request, Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';

@ApiTags('stripe')
@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly usersService: UsersService,
  ) {}

  @Post('create-checkout-session')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Stripe checkout session for subscription' })
  @ApiResponse({ status: 200, description: 'Checkout session created successfully' })
  async createCheckoutSession(
    @Body() body: { priceId: string; successUrl: string; cancelUrl: string },
    @GetUser() user: User,
  ) {
    const dto: CreateCheckoutSessionDto = {
      priceId: body.priceId,
      userId: user.id,
      userEmail: user.email,
      successUrl: body.successUrl,
      cancelUrl: body.cancelUrl,
    };

    const session = await this.stripeService.createCheckoutSession(dto);
    return { sessionId: session.id, url: session.url };
  }

  @Post('create-addon-session')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Stripe checkout session for addon purchases' })
  @ApiResponse({ status: 200, description: 'Addon checkout session created successfully' })
  async createAddonSession(
    @Body() body: { addonType: 'generations'; quantity: number; successUrl: string; cancelUrl: string },
    @GetUser() user: User,
  ) {
    const dto: CreateAddonSessionDto = {
      addonType: body.addonType,
      quantity: body.quantity,
      userId: user.id,
      userEmail: user.email,
      successUrl: body.successUrl,
      cancelUrl: body.cancelUrl,
    };

    const session = await this.stripeService.createAddonSession(dto);
    return { sessionId: session.id, url: session.url };
  }

  @Get('prices')
  @ApiOperation({ summary: 'Get available Stripe prices' })
  @ApiResponse({ status: 200, description: 'Prices retrieved successfully' })
  async getPrices() {
    const prices = await this.stripeService.getPrices();
    return { prices };
  }

  @Get('subscription-success')
  @ApiOperation({ summary: 'Show subscription success page' })
  async showSubscriptionSuccess(@Res() res: any) {
    try {
      const htmlPath = join(process.cwd(), 'public', 'views', 'subscription-success.html');
      const html = readFileSync(htmlPath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (error) {
      console.error('Error loading subscription success page:', error);
      res.status(500).send('Error loading page');
    }
  }

  @Get('subscription-cancel')
  @ApiOperation({ summary: 'Show subscription cancel page' })
  async showSubscriptionCancel(@Res() res: any) {
    try {
      const htmlPath = join(process.cwd(), 'public', 'views', 'subscription-cancel.html');
      const html = readFileSync(htmlPath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (error) {
      console.error('Error loading subscription cancel page:', error);
      res.status(500).send('Error loading page');
    }
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Handle Stripe webhooks' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @RawBody() payload: Buffer,
    @Req() req: Request,
  ) {
    try {
      if (!payload) {
        console.error('Webhook error: No payload received');
        throw new Error('No payload received');
      }

      const event = await this.stripeService.constructWebhookEvent(
        payload.toString(),
        signature,
      );

      // Handle different event types
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutSessionCompleted(event.data.object);
          break;
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object);
          break;
        case 'invoice.payment_succeeded':
          await this.handleInvoicePaymentSucceeded(event.data.object);
          break;
        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      console.error('Webhook error:', error);
      throw error;
    }
  }

  private async handleCheckoutSessionCompleted(session: any) {
    console.log('Checkout session completed:', session.id);
    
    const userId = session.metadata?.userId;
    if (!userId) {
      console.error('No userId in session metadata');
      return;
    }

    try {
      if (session.metadata?.type === 'subscription') {
        // Handle subscription activation
        const plan = this.stripeService.getPlanFromPriceId(session.line_items?.data[0]?.price?.id);
        if (plan) {
          await this.usersService.activateSubscription(userId, plan);
          console.log(`Subscription activated for user ${userId}, plan: ${plan}`);
        }
      } else if (session.metadata?.type === 'addon') {
        // Handle addon purchase
        const quantity = this.stripeService.getAddonQuantityFromMetadata(session.metadata);
        if (quantity > 0) {
          await this.usersService.addGenerations(userId, quantity);
          console.log(`${quantity} generations added for user ${userId}`);
        }
      }
    } catch (error) {
      console.error('Error handling checkout session completion:', error);
    }
  }

  private async handleSubscriptionUpdated(subscription: any) {
    console.log('Subscription updated:', subscription.id);
    
    const userId = subscription.metadata?.userId;
    if (!userId) return;

    try {
      if (subscription.status === 'active') {
        await this.usersService.setSubscriptionActive(userId);
        console.log(`Subscription reactivated for user ${userId}`);
      } else if (subscription.status === 'canceled') {
        await this.usersService.setSubscriptionCanceled(userId);
        console.log(`Subscription canceled for user ${userId}`);
      }
    } catch (error) {
      console.error('Error handling subscription update:', error);
    }
  }

  private async handleSubscriptionDeleted(subscription: any) {
    console.log('Subscription deleted:', subscription.id);
    
    const userId = subscription.metadata?.userId;
    if (!userId) return;

    try {
      await this.usersService.setSubscriptionCanceled(userId);
      console.log(`Subscription canceled for user ${userId}`);
    } catch (error) {
      console.error('Error handling subscription deletion:', error);
    }
  }

  private async handleInvoicePaymentSucceeded(invoice: any) {
    console.log('Invoice payment succeeded:', invoice.id);
    // Handle successful recurring payment
  }

  private async handleInvoicePaymentFailed(invoice: any) {
    console.log('Invoice payment failed:', invoice.id);
    // Handle failed payment
  }

  // // ===== SIMULATION ENDPOINTS FOR TESTING =====
  
  // @Post('simulate/subscription-activated')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Simulate subscription activation (for testing)' })
  // @ApiResponse({ status: 200, description: 'Subscription activated successfully' })
  // async simulateSubscriptionActivated(
  //   @Body() body: { plan: UserPlan },
  //   @GetUser() user: User,
  // ) {
  //   const updatedUser = await this.usersService.activateSubscription(user.id, body.plan);
  //   return {
  //     message: 'Subscription activated successfully',
  //     user: {
  //       id: updatedUser.id,
  //       plan: updatedUser.plan,
  //       subscriptionStatus: updatedUser.subscriptionStatus,
  //       remainingGenerations: updatedUser.remainingGenerations,
  //       totalGenerations: updatedUser.totalGenerations,
  //       subscriptionExpiresAt: updatedUser.subscriptionExpiresAt,
  //     },
  //   };
  // }

  // @Post('simulate/subscription-canceling')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Simulate subscription canceling (for testing)' })
  // @ApiResponse({ status: 200, description: 'Subscription status set to canceling' })
  // async simulateSubscriptionCanceling(@GetUser() user: User) {
  //   const updatedUser = await this.usersService.setSubscriptionCanceling(user.id);
  //   return {
  //     message: 'Subscription status set to canceling',
  //     user: {
  //       id: updatedUser.id,
  //       plan: updatedUser.plan,
  //       subscriptionStatus: updatedUser.subscriptionStatus,
  //       remainingGenerations: updatedUser.remainingGenerations,
  //       subscriptionExpiresAt: updatedUser.subscriptionExpiresAt,
  //     },
  //   };
  // }

  // @Post('simulate/subscription-canceled')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Simulate subscription cancellation (for testing)' })
  // @ApiResponse({ status: 200, description: 'Subscription status set to canceled' })
  // async simulateSubscriptionCanceled(@GetUser() user: User) {
  //   const updatedUser = await this.usersService.setSubscriptionCanceled(user.id);
  //   return {
  //     message: 'Subscription status set to canceled',
  //     user: {
  //       id: updatedUser.id,
  //       plan: updatedUser.plan,
  //       subscriptionStatus: updatedUser.subscriptionStatus,
  //       remainingGenerations: updatedUser.remainingGenerations,
  //       totalGenerations: updatedUser.totalGenerations,
  //       subscriptionExpiresAt: updatedUser.subscriptionExpiresAt,
  //     },
  //   };
  // }

  // @Post('simulate/add-generations')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Simulate adding generations (for testing)' })
  // @ApiResponse({ status: 200, description: 'Generations added successfully' })
  // async simulateAddGenerations(
  //   @Body() body: { count: number },
  //   @GetUser() user: User,
  // ) {
  //   const updatedUser = await this.usersService.addGenerations(user.id, body.count);
  //   return {
  //     message: `${body.count} generations added successfully`,
  //     user: {
  //       id: updatedUser.id,
  //       plan: updatedUser.plan,
  //       subscriptionStatus: updatedUser.subscriptionStatus,
  //       remainingGenerations: updatedUser.remainingGenerations,
  //       totalGenerations: updatedUser.totalGenerations,
  //     },
  //   };
  // }

  // @Get('simulate/user-status')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Get current user subscription status (for testing)' })
  // @ApiResponse({ status: 200, description: 'User status retrieved successfully' })
  // async getUserStatus(@GetUser() user: User) {
  //   return {
  //     user: {
  //       id: user.id,
  //       email: user.email,
  //       name: user.name,
  //       plan: user.plan,
  //       subscriptionStatus: user.subscriptionStatus,
  //       remainingGenerations: user.remainingGenerations,
  //       totalGenerations: user.totalGenerations,
  //       subscriptionExpiresAt: user.subscriptionExpiresAt,
  //       canGenerate: user.canGenerate(),
  //       isSubscriptionActive: user.isSubscriptionActive(),
  //       planLimits: user.getPlanLimits(),
  //     },
  //   };
  // }
}

