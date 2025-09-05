import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenerationsService } from './generations.service';
import { GenerationsController } from './generations.controller';
import { Generation } from './entities/generation.entity';
import { OpenaiModule } from '../openai/openai.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Generation]),
    OpenaiModule,
    UsersModule,
  ],
  providers: [GenerationsService],
  controllers: [GenerationsController],
  exports: [GenerationsService],
})
export class GenerationsModule {}

