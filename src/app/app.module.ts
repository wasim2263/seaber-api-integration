import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {OrderModule} from "./order/order.module";
import {BullModule} from "@nestjs/bull";
import {Order} from "./order/entities/order.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Order],
      synchronize: true,
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    OrderModule,
  ],
})
export class AppModule {}
