import {Module} from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import {ApiRequestService} from "./api-request.service";
import {Order} from "./entities/order.entity";
import {httpOptionsConfig} from "../../options/http.option";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  controllers: [OrderController],
  providers: [OrderService, ApiRequestService],
  imports:[
    HttpModule.register(httpOptionsConfig),
    TypeOrmModule.forFeature([
      Order
    ]),]
})
export class OrderModule {}
