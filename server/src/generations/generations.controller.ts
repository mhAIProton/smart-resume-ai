import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GenerationsService, CreateGenerationDto } from './generations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('generations')
@Controller('generations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GenerationsController {
  constructor(private readonly generationsService: GenerationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new generation request' })
  @ApiResponse({ status: 201, description: 'Generation request created successfully' })
  async create(
    @Body() createGenerationDto: CreateGenerationDto,
    @GetUser() user: User,
  ) {
    return this.generationsService.create(user.id, createGenerationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user generations' })
  @ApiResponse({ status: 200, description: 'Generations retrieved successfully' })
  async findAll(@GetUser() user: User) {
    return this.generationsService.findAll(user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get generation statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats(@GetUser() user: User) {
    return this.generationsService.getGenerationStats(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific generation' })
  @ApiResponse({ status: 200, description: 'Generation retrieved successfully' })
  async findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.generationsService.findOne(id, user.id);
  }

  @Post(':id/regenerate')
  @ApiOperation({ summary: 'Regenerate a completed generation' })
  @ApiResponse({ status: 200, description: 'Generation regenerated successfully' })
  async regenerate(@Param('id') id: string, @GetUser() user: User) {
    return this.generationsService.regenerate(id, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a generation' })
  @ApiResponse({ status: 200, description: 'Generation deleted successfully' })
  async remove(@Param('id') id: string, @GetUser() user: User) {
    await this.generationsService.remove(id, user.id);
    return { message: 'Generation deleted successfully' };
  }
}

