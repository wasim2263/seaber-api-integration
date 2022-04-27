import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {OrderModule} from "../app/order/order.module";
import {getRepositoryToken} from "@nestjs/typeorm";
import {Order} from "../app/order/entities/order.entity";
import {ValidationPipe} from "../common/validation.pipe";

describe('OrderController (e2e)', () => {
    let app: INestApplication;
    const mockOrderRepository = {
        store: jest.fn().mockImplementation((dto) => Promise.resolve(dto))
    }
    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [OrderModule],
        }).overrideProvider(getRepositoryToken(Order)).useValue(mockOrderRepository).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe())
        await app.init();
    });

    it('order (POST)', () => {
        const orderPayload = {
            extOrderId: "bda73cd4-30a0-40e5-bd0b-2bc3c907be47",
            type: "fromto"
        }
        return request(app.getHttpServer())
            .post('/order')
            .send(orderPayload)
            .expect(400)
    });
    it('order (POST)', () => {
        const orderPayload = {
            extOrderId: "bda73cd4-30a0-40e5-bd0b-2bc3c907be47",
            type: "from",
            fromLocation:"Dhaka"

        }
        return request(app.getHttpServer())
            .post('/order')
            .send(orderPayload)
            .expect(200)
    });
});
