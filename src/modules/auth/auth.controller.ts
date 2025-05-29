import {
  Body,
  Controller,
  HttpStatus,
  Patch,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { routesV1 } from '@src/configs/app.routes';
import { ApiErrorResponse } from '@src/libs/api/api-error.response';
import { IdResponse } from '@src/libs/api/id.response.dto';
import { UserAlreadyExistsError, UserNotFoundError } from '../user/user.errors';
import { CreateUserRequestDto } from '../user/commands/create-user/create-user.request.dto';
import { CreateUserCommand } from '../user/commands/create-user/create-user.command';
import { CommandBus } from '@nestjs/cqrs';
import { AggregateId } from '@src/libs/ddd';
import { LoginUserResponseDto } from './dtos/login-user.response.dto';
import { LoginUserRequestDto } from './dtos/login-user.request.dto';
import { CookiesService } from './libs/cookies/cookies.service';
import { AuthService } from './services/auth.service';
import { VerifyUserRequestDto } from './dtos/verify-user.request.dto';
import { JwtRefreshGuard } from './libs/guard/jwt-refresh-guard';

@Controller(routesV1.version)
@ApiTags(routesV1.auth.tag)
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly cookiesService: CookiesService,
    private readonly authService: AuthService,
  ) {}

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

    const id: AggregateId = await this.commandBus.execute(command);

    return new IdResponse(id);
  }

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

    const result = await this.authService.login(loginDto, cookies);

    this.cookiesService.signCookie(response, result.refreshToken);
    return result;
  }

  @Patch(routesV1.auth.verify)
  @ApiOperation({
    summary: 'Verify an account',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginUserResponseDto,
  })
  async verify(
    @Body() verifyDto: VerifyUserRequestDto,
    @Response({ passthrough: true }) response,
  ) {
    const result = await this.authService.confirmEmail(verifyDto.token);

    this.cookiesService.signCookie(response, result.refreshToken);

    return result;
  }

  @Post(routesV1.auth.refresh)
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({
    summary: 'Refresh an access token',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: LoginUserResponseDto,
  })
  async refreshToken(
    @Request() request,
    @Response({ passthrough: true }) response,
  ) {
    const cookiesRefreshToken = this.cookiesService.checkCookie(
      request.cookies,
    );
    const result = await this.authService.refreshToken(
      cookiesRefreshToken,
      request.user.id,
    );
    this.cookiesService.signCookie(response, result.refreshToken);

    return result;
  }
}
