import {Module} from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import {BullModule} from "@nestjs/bull";
import {ApiRequestService} from "./api-request.service";
import {Order} from "./entities/order.entity";
import {httpOptionsConfig} from "../../options/http.option";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  controllers: [OrderController],
  providers: [OrderService, ApiRequestService],
  imports:[
    BullModule.registerQueue({
      name: 'process-order',
    }),
    HttpModule.register(httpOptionsConfig),
    TypeOrmModule.forFeature([
      Order
    ]),]
})
export class OrderModule {}
