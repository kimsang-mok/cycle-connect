import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBikeRequestDto } from './create-bike.request.dto';
import { CreateBikeCommand } from './create-bike.command';
import { Result } from 'oxide.ts';
import { AggregateId } from '@src/libs/ddd';
import { match } from 'oxide.ts';
import { IdResponse } from '@src/libs/api/id.response.dto';
import { routesV1 } from '@src/configs/app.routes';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Roles } from '@src/modules/auth/roles.decorator';
import { UserRoles } from '@src/modules/user/domain/user.types';
import { JwtAuthGuard } from '@src/modules/auth/libs/guard/jwt-auth-guard';
import { RolesGuard } from '@src/modules/auth/libs/guard/roles.guard';

@Controller(routesV1.version)
export class CreateBikeController {
  constructor(private commandBus: CommandBus) {}

  @Post(routesV1.bike.root)
  @Roles(UserRoles.admin, UserRoles.renter)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create a new bike listing' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateBikeRequestDto })
  @ApiCreatedResponse({
    description: 'Bike created successfully',
    type: IdResponse,
  })
  async create(@Body() body: CreateBikeRequestDto) {
    const command = new CreateBikeCommand({ ...body });

    const result: Result<AggregateId, any> =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (id: string) => new IdResponse(id),
      Err: (error) => {
        throw error;
      },
    });
  }
}
