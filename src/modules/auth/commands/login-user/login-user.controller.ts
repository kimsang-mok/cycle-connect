import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Request,
  Response,
} from '@nestjs/common';
import { CookiesService } from '../../libs/cookies/cookies.service';
import { LoginUserResponseDto } from './login-user.response.dto';
import { CommandBus } from '@nestjs/cqrs';
import { LoginUserCommand } from './login-user.command';
import { routesV1 } from '@src/configs/app.routes';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserNotFoundError } from '@src/modules/user/user.errors';
import { ApiErrorResponse } from '@src/libs/api/api-error.response';
import { LoginUserRequestDto } from './login-user.request.dto';

@Controller(routesV1.version)
export class LoginUserController {
  constructor(
    private commandBus: CommandBus,
    private cookiesService: CookiesService,
  ) {}

  @Post(routesV1.auth.login)
  @ApiOperation({
    summary: 'Login',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginUserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: UserNotFoundError.message,
    type: ApiErrorResponse,
  })
  async login(
    @Body() loginDto: LoginUserRequestDto,
    @Request() request,
    @Response({ passthrough: true }) response,
  ) {
    const { cookies } = request;

    const command = new LoginUserCommand({ ...loginDto, cookies });

    const result = await this.commandBus.execute(command);

    const { user, token, refreshToken } = result.unwrap();

    this.cookiesService.signCookie(response, refreshToken);

    return {
      user,
      accessToken: token,
    };
  }
}
