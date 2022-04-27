import { Injectable } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class OrderService {
  constructor(@InjectQueue('process-order') private processOrderQueue: Queue) {}

  store(orderData: OrderDto) {
    console.log(orderData);
    this.processOrderQueue.add(
        orderData,
        // { delay: 3000 }, // 3 seconds delayed
    );
    return {};
  }
}
