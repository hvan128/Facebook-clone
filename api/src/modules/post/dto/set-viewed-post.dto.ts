import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class SetViewedPost {
    @ApiProperty({ type: 'string', example: '1' })
    @Type(() => Number)
    @IsInt()
    id: number;
}
