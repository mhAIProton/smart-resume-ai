import { Controller, Post, Get, Body, Headers, RawBody, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StripeService, CreateCheckoutSessionDto, CreateAddonSessionDto } from './stripe.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { Request } from 'express';

@ApiTags('stripe')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

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

  @Post('webhook')
  @ApiOperation({ summary: 'Handle Stripe webhooks' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @RawBody() payload: Buffer,
    @Req() req: Request,
  ) {
    try {
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
    // Handle successful payment
    // Update user plan, add generations, etc.
  }

  private async handleSubscriptionUpdated(subscription: any) {
    console.log('Subscription updated:', subscription.id);
    // Handle subscription changes
  }

  private async handleSubscriptionDeleted(subscription: any) {
    console.log('Subscription deleted:', subscription.id);
    // Handle subscription cancellation
  }

  private async handleInvoicePaymentSucceeded(invoice: any) {
    console.log('Invoice payment succeeded:', invoice.id);
    // Handle successful recurring payment
  }

  private async handleInvoicePaymentFailed(invoice: any) {
    console.log('Invoice payment failed:', invoice.id);
    // Handle failed payment
  }
}

