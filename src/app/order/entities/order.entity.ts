import {Column, CreateDateColumn, Entity, UpdateDateColumn} from "typeorm";
import {BaseEntity} from "./base.entity";

export enum OrderMessageStatus {
    PENDING = 'Pending',
    PROCESSING = 'Processing',
    DELIVERED = 'Delivered',
    FAILED='Failed'
}

@Entity()
export class Order extends BaseEntity {

    @Column('uuid', {unique: true})
    order_id: string;

    @Column({length: 255, nullable: true})
    from_location: string;

    @Column({length: 255, nullable: true})
    to_location: string;

    @Column({length: 255, nullable: true})
    cargo_type: string;

    @Column('float', {default: 0})
    cargo_amount: number;

    @Column({
        type: 'enum',
        enum: OrderMessageStatus,
        default: OrderMessageStatus.PENDING,
    })
    message_sending_status: OrderMessageStatus;

}
