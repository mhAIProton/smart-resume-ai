import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';

import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GenerationsModule } from './generations/generations.module';
import { OrdersModule } from './orders/orders.module';
import { OpenaiModule } from './openai/openai.module';
import { StripeModule } from './stripe/stripe.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
      },
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UsersModule,
    GenerationsModule,
    OrdersModule,
    OpenaiModule,
    StripeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

