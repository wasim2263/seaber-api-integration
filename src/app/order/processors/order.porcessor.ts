import {InjectQueue, Process, Processor} from '@nestjs/bull';
import {Job, Queue} from 'bull';
import {InjectRepository} from "@nestjs/typeorm";
import {Injectable} from "@nestjs/common";
import {Order, OrderMessageStatus} from "../entities/order.entity";
import {Repository} from "typeorm";
import {OrderType} from "../dto/order.dto";

@Injectable()
@Processor('process-order')
export class ProcessOrderConsumer {
    constructor(
        @InjectQueue('seaber-send-order-data') private seaberSendOrderDataQueue: Queue,
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
    ) {}

    @Process()
    async processOrder(job: Job<unknown>) {
        console.log(job.data);
        const orderData: any = job.data;
        //checking for existing data for create or update record
        let order = await this.orderRepository.findOne({order_id:orderData.extOrderId})

        if(!order){
            order = await this.orderRepository.create({
                order_id: orderData.extOrderId
            });
        }
        if(order){
            if (orderData.type == OrderType.TO) {
                order.to_location= orderData.toLocation;
            }else if(orderData.type== OrderType.FROM){
                order.from_location = orderData.fromLocation
            }else if(orderData.type == OrderType.CARGO){
                order.cargo_type = orderData.cargoType;
                order.cargo_amount = orderData.cargoAmount;
            }


            if (order.to_location && order.cargo_amount > 0 && order.from_location){
                order.message_sending_status = OrderMessageStatus.PROCESSING;
                //sending to another queue to manage failed or interrupted queue
                this.seaberSendOrderDataQueue.add(order, {delay:2000});
            }
            this.orderRepository.save(order);

        }
    }
}
