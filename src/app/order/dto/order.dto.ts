import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {IsEnum, IsNumber, IsOptional, IsString, IsUUID} from 'class-validator';


export enum OrderType {
    FROM = 'from',
    TO = 'to',
    CARGO = 'cargo',
}
export class OrderDto {
    @ApiProperty()
    @IsUUID()
    readonly extOrderId: string;

    @ApiProperty()
    @IsEnum(OrderType)
    readonly type: OrderType;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    readonly fromLocation?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    readonly toLocation?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    readonly cargoType?: string;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    readonly cargoAmount?: number;

}
