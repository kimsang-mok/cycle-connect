import { PaginatedResponseDto } from '@src/libs/api/paginated.response.base';
import { BikeResponseDto } from './bike.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class BikePaginatedResponseDto extends PaginatedResponseDto<BikeResponseDto> {
  @ApiProperty({ type: BikeResponseDto, isArray: true })
  readonly data: readonly BikeResponseDto[];
}
