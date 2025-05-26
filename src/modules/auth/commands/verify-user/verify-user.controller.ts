import { CommandBus } from '@nestjs/cqrs';
import { CookiesService } from '../../libs/cookies/cookies.service';
import {
  Body,
  Controller,
  HttpStatus,
  Patch,
  Request,
  Response,
} from '@nestjs/common';
import { routesV1 } from '@src/configs/app.routes';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VerifyUserRequestDto } from './verify-user.request.dto';
import { VerifyUserCommand } from './verify-user.command';
import { LoginUserResponseDto } from '../login-user/login-user.response.dto';
import { match, Result } from 'oxide.ts';

@Controller(routesV1.version)
@ApiTags(routesV1.auth.tag)
export class VerifyUserController {
  constructor(
    private commandBus: CommandBus,
    private cookiesService: CookiesService,
  ) {}

  @Patch(routesV1.auth.verify)
  @ApiOperation({
    summary: 'Verify account',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginUserResponseDto,
  })
  async verify(
    @Body() verifyDto: VerifyUserRequestDto,
    @Request() request,
    @Response({ passthrough: true }) response,
  ) {
    const { cookies } = request;
    const command = new VerifyUserCommand({
      ...verifyDto,
      cookies,
    });

    const result: Result<LoginUserResponseDto, any> =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (result: LoginUserResponseDto) => {
        this.cookiesService.signCookie(response, result.refreshToken);
        return result;
      },
      Err: (error) => {
        throw error;
      },
    });
  }
}
