import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { routesV1 } from '@src/configs/app.routes';
import { JwtAuthGuard } from '@src/modules/auth/libs/guard/jwt-auth-guard';
import { RolesGuard } from '@src/modules/auth/libs/guard/roles.guard';
import { Roles } from '@src/modules/auth/roles.decorator';
import { UserRoles } from '@src/modules/user/domain/user.types';
import { CreateBookingRequestDto } from './create-booking.request.dto';
import { IdResponse } from '@src/libs/api/id.response.dto';
import { CreateBookingCommand } from './create-booking.command';
import { Result } from 'oxide.ts';
import { AggregateId } from '@src/libs/ddd';
import { match } from 'oxide.ts';

@Controller(routesV1.version)
@ApiTags(routesV1.booking.tag)
export class CreateBookingController {
  constructor(private commandBus: CommandBus) {}

  @Post(routesV1.booking.root)
  @Roles(UserRoles.admin, UserRoles.customer)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Book a bike' })
  @ApiBearerAuth()
  @ApiBody({
    type: CreateBookingRequestDto,
  })
  @ApiCreatedResponse({
    description: 'Booking created successfully',
    type: IdResponse,
  })
  async create(@Body() body: CreateBookingRequestDto, @Request() request) {
    const command = new CreateBookingCommand({
      ...body,
      customerId: request.user.id,
    });

    const result: Result<AggregateId, any> =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (id: string) => new IdResponse(id),
    });
  }
}
