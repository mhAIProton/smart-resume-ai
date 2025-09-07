import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService, CreateOrderDto } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() user: User,
  ) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user orders' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  async findAll(@GetUser() user: User) {
    return this.ordersService.findAll(user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get order statistics' })
  @ApiResponse({ status: 200, description: 'Order statistics retrieved successfully' })
  async getStats(@GetUser() user: User) {
    return this.ordersService.getOrderStats(user.id);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent orders' })
  @ApiResponse({ status: 200, description: 'Recent orders retrieved successfully' })
  async getRecent(@GetUser() user: User) {
    return this.ordersService.getRecentOrders(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific order' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  async findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.ordersService.findOne(id, user.id);
  }
}

