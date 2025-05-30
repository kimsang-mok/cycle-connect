import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { routesV1 } from '@src/configs/app.routes';
import { UserPaginatedResponseDto } from '../../dtos/user.paginated.response.dto';
import { FindUsersRequestDto } from './find-users.request.dto';
import { PaginatedQueryRequestDto } from '@src/libs/api/paginated-query.request.dto';
import { FindUsersQuery } from './find-users.query-handler';
import { Paginated } from '@src/libs/ddd';
import { UserModel } from '../../database/user.schema';
import { ResponseBase } from '@src/libs/api/response.base';
import { JwtAuthGuard } from '@src/modules/auth/libs/guard/jwt-auth-guard';
import { RolesGuard } from '@src/modules/auth/libs/guard/roles.guard';
import { UserRoles } from '../../domain/user.types';
import { Roles } from '@src/modules/auth/roles.decorator';

@Controller(routesV1.version)
@ApiTags(routesV1.user.tag)
export class FindUsersController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(routesV1.user.root)
  @Roles(UserRoles.admin, UserRoles.renter)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Find users',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserPaginatedResponseDto,
  })
  async findUsers(
    @Body() request: FindUsersRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<UserPaginatedResponseDto> {
    const query = new FindUsersQuery({
      ...request,
      limit: queryParams?.limit,
      page: queryParams?.page,
    });

    const result: Paginated<UserModel> = await this.queryBus.execute(query);

    const paginated = result;

    // Whitelisting returned properties

    return new UserPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map((user) => ({
        ...new ResponseBase(user),
        email: user.email,
      })),
    });
  }
}
