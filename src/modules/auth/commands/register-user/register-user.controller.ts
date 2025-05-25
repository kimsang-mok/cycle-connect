import {
  Body,
  HttpStatus,
  Post,
  ConflictException as ConflictHttpException,
  Controller,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { routesV1 } from '@src/configs/app.routes';
import { ApiErrorResponse } from '@src/libs/api/api-error.response';
import { IdResponse } from '@src/libs/api/id.response.dto';
import { AggregateId } from '@src/libs/ddd';
import { CreateUserCommand } from '@src/modules/user/commands/create-user/create-user.command';
import { CreateUserRequestDto } from '@src/modules/user/commands/create-user/create-user.request.dto';
import { UserAlreadyExistsError } from '@src/modules/user/user.errors';
import { match, Result } from 'oxide.ts';

@Controller(routesV1.version)
export class RegisterUserController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({
    summary: 'Register a user',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: IdResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: UserAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @Post(routesV1.auth.register)
  async register(@Body() body: CreateUserRequestDto): Promise<IdResponse> {
    const command = new CreateUserCommand(body);

    const result: Result<AggregateId, UserAlreadyExistsError> =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (id: string) => new IdResponse(id),
      Err: (error: Error) => {
        if (error instanceof UserAlreadyExistsError)
          throw new ConflictHttpException(error.message);
        throw error;
      },
    });
  }
}
