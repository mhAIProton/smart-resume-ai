import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Security middleware
  app.use(helmet());
  app.use(compression());

  // Middleware для raw body только для webhook endpoint
  app.use('/api/v1/stripe/webhook', express.raw({ type: 'application/json' }));

  // CORS configuration
  app.enableCors({
    origin: [
      'chrome-extension://*',
      'https://smartresume-ai.com',
      'https://*.smartresume-ai.com',
      'http://localhost:3000',
      'http://localhost:5173'
    ],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('SmartResumeAI API')
    .setDescription('API for AI-powered resume and cover letter generation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('generations', 'Resume and cover letter generation')
    .addTag('orders', 'Order and payment management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Global prefix
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  // console.log(`🚀 SmartResumeAI API is running on: http://localhost:${port}`);
  // console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();

