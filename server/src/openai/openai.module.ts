import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenaiService } from './openai.service';
import { OpenaiController } from './openai.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ConfigModule, UsersModule],
  providers: [OpenaiService],
  controllers: [OpenaiController],
  exports: [OpenaiService],
})
export class OpenaiModule {}

