import { CommandBus } from '@nestjs/cqrs';
import { CookiesService } from '../../libs/cookies/cookies.service';
import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Request,
  Response,
} from '@nestjs/common';
import { routesV1 } from '@src/configs/app.routes';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VerifyUserRequestDto } from './verify-user.request.dto';
import { VerifyUserCommand } from './verify-user.command';
import { LoginUserResponseDto } from '../login-user/login-user.response.dto';

@Controller(routesV1.version)
export class VerifyUserController {
  constructor(
    private commandBus: CommandBus,
    private cookiesService: CookiesService,
  ) {}

  @Post(routesV1.auth.verify)
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

    const result = await this.commandBus.execute(command);

    const { user, token, refreshToken } = result.unwrap();

    this.cookiesService.signCookie(response, refreshToken);

    return {
      user,
      accessToken: token,
    };
  }
}
