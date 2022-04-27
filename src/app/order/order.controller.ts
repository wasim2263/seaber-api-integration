import {Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  store(@Body() orderDto: OrderDto): any {
    return this.orderService.store(orderDto);
  }
}
