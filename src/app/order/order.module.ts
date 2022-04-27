import {Module} from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import {BullModule} from "@nestjs/bull";
import {ApiRequestService} from "./api-request.service";
import {Order} from "./entities/order.entity";
import {httpOptionsConfig} from "../../options/http.option";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProcessOrderConsumer} from "./processors/order.porcessor";
import {SeaberSendOrderDataConsumer} from "./processors/seaber-send-order-data.porcessor";

@Module({
  controllers: [OrderController],
  providers: [OrderService, ApiRequestService, ProcessOrderConsumer, SeaberSendOrderDataConsumer],
  imports:[
    BullModule.registerQueue({
      name: 'process-order',
    }),
    BullModule.registerQueue({
      name: 'seaber-send-order-data',
    }),
    HttpModule.register(httpOptionsConfig),
    TypeOrmModule.forFeature([
      Order
    ]),]
})
export class OrderModule {}
