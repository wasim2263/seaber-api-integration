import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import {InjectRepository} from "@nestjs/typeorm";
import {HttpStatus, Injectable} from "@nestjs/common";
import {Order, OrderMessageStatus} from "../entities/order.entity";
import {Repository} from "typeorm";
import {OrderType} from "../dto/order.dto";
import {ApiRequestService} from "../api-request.service";

@Injectable()
@Processor('process-order')
export class ProcessOrderConsumer {
    constructor(
        private readonly apiRequestService: ApiRequestService,

        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
    ) {}

    @Process()
    async processOrder(job: Job<unknown>) {
        console.log(job.data);
        const orderData: any = job.data;
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

            this.orderRepository.save(order);
            console.log(order);
            if (order.to_location && order.cargo_amount && order.from_location){
                const orderPayload = {
                    toLocation:order.to_location
                }
                console.log('api calling', orderPayload);
                //middleware api  'api/orders/create-order'
                const response = await this.apiRequestService.postRequest(
                    '',
                    orderPayload,
                );
                // console.log(response)
                const a = await  response.toPromise()
                console.log('------ processor',a.status)
                if(a.status==HttpStatus.OK){
                    order.message_sending_status = OrderMessageStatus.DELIVERED
                    this.orderRepository.save(order);
                }else{
                    order.message_sending_status = OrderMessageStatus.FAILED
                    this.orderRepository.save(order);
                }
            }
        }
        // return {};
    }
}
