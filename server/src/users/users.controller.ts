import { Controller, Get, Patch, UseGuards, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService, UpdateUserDto } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User, UserPlan } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  async getProfile(@GetUser() user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      plan: user.plan,
      remainingGenerations: user.remainingGenerations,
      totalGenerations: user.totalGenerations,
      planLimits: user.getPlanLimits(),
      isSubscriptionActive: user.isSubscriptionActive(),
      createdAt: user.createdAt,
    };
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'User profile updated successfully' })
  async updateProfile(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.update(user.id, updateUserDto);
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      avatar: updatedUser.avatar,
      plan: updatedUser.plan,
      remainingGenerations: updatedUser.remainingGenerations,
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get user statistics' })
  @ApiResponse({ status: 200, description: 'User statistics retrieved successfully' })
  async getUserStats(@GetUser() user: User) {
    return {
      totalGenerations: user.totalGenerations,
      remainingGenerations: user.remainingGenerations,
      plan: user.plan,
      planLimits: user.getPlanLimits(),
      isSubscriptionActive: user.isSubscriptionActive(),
      canGenerate: user.canGenerate(),
    };
  }
}

