import {Processor, Process} from '@nestjs/bull';
import {Job} from 'bull';
import {InjectRepository} from "@nestjs/typeorm";
import {HttpStatus, Injectable} from "@nestjs/common";
import {Order, OrderMessageStatus} from "../entities/order.entity";
import {Repository} from "typeorm";
import {ApiRequestService} from "../api-request.service";

@Injectable()
@Processor('seaber-send-order-data')
export class SeaberSendOrderDataConsumer {
    constructor(
        private readonly apiRequestService: ApiRequestService,
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
    ) {
    }

    @Process()
    async seaberSendOrderData(job: Job<Order>) {
        console.log('in seaber-send-order-data', job.data);
        const order: Order = job.data;

        const orderPayload = {
            extOrderId: order.order_id,
            fromLocation: order.from_location,
            cargoType: order.cargo_type,
            cargoAmount: order.cargo_amount,
        }
        console.log('api calling', orderPayload);
        const response = await this.apiRequestService.postRequest(
            '',
            orderPayload,
        );
        // console.log(response)
        const a = await response.toPromise()
        console.log('------ seaber-send-order-data api call response status', a.status)
        //can manage anything regarding delivery. maybe recall the queue for sending again if failed
        if (a.status == HttpStatus.OK) {
            order.message_sending_status = OrderMessageStatus.DELIVERED
            this.orderRepository.save(order);
        } else {
            order.message_sending_status = OrderMessageStatus.FAILED
            this.orderRepository.save(order);
        }
    }
}

