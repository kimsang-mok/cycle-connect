import { Controller, Param, Patch, Request, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesV1 } from '@src/configs/app.routes';
import { ActivateBikeCommand } from './activate-bike.command';
import { IdResponse } from '@src/libs/api/id.response.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '@src/modules/auth/roles.decorator';
import { UserRoles } from '@src/modules/user/domain/user.types';
import { JwtAuthGuard } from '@src/modules/auth/libs/guard/jwt-auth-guard';
import { RolesGuard } from '@src/modules/auth/libs/guard/roles.guard';

@Controller(routesV1.version)
@ApiTags(routesV1.bike.tag)
export class ActivateBikeController {
  constructor(private commandBus: CommandBus) {}

  @Patch(routesV1.bike.activate)
  @Roles(UserRoles.renter)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Activate a bike',
    description:
      'Allows a bike owner to activate their bike, making it available for rent.',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  async activate(@Param('id') id: string, @Request() request) {
    const command = new ActivateBikeCommand({
      requesterId: request.user.id,
      bikeId: id,
    });

    const result = await this.commandBus.execute(command);

    return new IdResponse(result);
  }
}
