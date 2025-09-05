import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GenerationsService } from './generations/generations.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const generationsService = app.get(GenerationsService);
  
  console.log('🚀 SmartResumeAI Worker is running...');
  
  // Worker logic would go here
  // For example, processing background jobs, handling webhooks, etc.
  
  // Keep the worker running
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await app.close();
    process.exit(0);
  });
  
  process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    await app.close();
    process.exit(0);
  });
}

bootstrap();

