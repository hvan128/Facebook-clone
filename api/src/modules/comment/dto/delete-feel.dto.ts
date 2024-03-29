import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class DeleteFeelDto {
    @ApiProperty({ type: 'string', example: '1' })
    @Type(() => Number)
    @IsInt()
    id: number;
}
