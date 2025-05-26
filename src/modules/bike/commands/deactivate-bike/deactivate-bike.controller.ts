import { Controller, Param, Patch, Request, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesV1 } from '@src/configs/app.routes';
import { DeactivateBikeCommand } from './deactivate-bike.command';
import { match } from 'oxide.ts';
import { IdResponse } from '@src/libs/api/id.response.dto';
import { Roles } from '@src/modules/auth/roles.decorator';
import { JwtAuthGuard } from '@src/modules/auth/libs/guard/jwt-auth-guard';
import { RolesGuard } from '@src/modules/auth/libs/guard/roles.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserRoles } from '@src/modules/user/domain/user.types';

@Controller(routesV1.version)
@ApiTags(routesV1.bike.tag)
export class DeactivateBikeController {
  constructor(private commandBus: CommandBus) {}

  @Patch(routesV1.bike.deactivate)
  @Roles(UserRoles.renter)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Deactivate a bike',
    description:
      'Allows a bike owner to deactivate their bike, making it unavailable for rent.',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  async deactivate(@Param('id') id: string, @Request() request) {
    const command = new DeactivateBikeCommand({
      requesterId: request.user.id,
      bikeId: id,
    });

    const result = await this.commandBus.execute(command);

    return match(result, {
      Ok: (id: string) => new IdResponse(id),
      Err: (error) => {
        throw error;
      },
    });
  }
}
