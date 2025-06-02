import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Query,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { routesV1 } from '@src/configs/app.routes';
import { BikePaginatedResponseDto } from '../../dtos/bike.paginated.response.dto';
import { FindBikesRequestDto } from './find-bikes.request.dto';
import { PaginatedQueryRequestDto } from '@src/libs/api/paginated-query.request.dto';
import { FindBikesQuery } from './find-bikes.query-handler';
import { Paginated } from '@src/libs/ddd';
import { BikeModel } from '../../database/bike.schema';
import { ResponseBase } from '@src/libs/api/response.base';
import { FileUrlResolverPort } from '@src/modules/file/uploader/ports/file-url-resolver.port';
import { FILE_URL_RESOLVER } from '@src/modules/file/file.di-tokens';

@Controller(routesV1.version)
@ApiTags(routesV1.bike.tag)
export class FindBikesController {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(FILE_URL_RESOLVER)
    private readonly fileUrlResolver: FileUrlResolverPort,
  ) {}

  @Get(routesV1.bike.root)
  @ApiOperation({ summary: 'Find bikes' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BikePaginatedResponseDto,
  })
  async findBikes(
    @Body() request: FindBikesRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ) {
    const query = new FindBikesQuery({
      ...request,
      limit: queryParams?.limit,
      page: queryParams?.page,
    });

    const result: Paginated<BikeModel> = await this.queryBus.execute(query);

    return new BikePaginatedResponseDto({
      ...result,
      data: result.data.map((bike) => ({
        ...new ResponseBase(bike),
        type: bike.type,
        model: bike.model,
        enginePower: bike.enginePower,
        pricePerDay: bike.pricePerDay,
        description: bike.description,
        ownerId: bike.ownerId,
        isActive: bike.isActive,
        thumbnailUrl: this.fileUrlResolver.resolveUrl(bike.thumbnailKey),
        photoUrls: bike.photoKeys.map((key) =>
          this.fileUrlResolver.resolveUrl(key),
        ),
      })),
    });
  }
}
