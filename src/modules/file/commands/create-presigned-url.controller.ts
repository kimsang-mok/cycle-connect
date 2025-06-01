import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesV1 } from '@src/configs/app.routes';
import { PresignedUrlRequestDto } from '../dtos/presigned-url.request.dto';
import { CreatePresignedUrlCommand } from './create-presigned-url.command';
import { PresignedRequest } from '../domain/value-objects/presigned-request.value-object';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/modules/auth/libs/guard/jwt-auth-guard';

@Controller(routesV1.version)
@ApiTags(routesV1.upload.tag)
export class CreatePresignedUrlController {
  constructor(private commandBus: CommandBus) {}

  @Post(routesV1.upload.presign)
  @UseGuards(JwtAuthGuard)
  async generate(@Body() body: PresignedUrlRequestDto, @Request() request) {
    console.log(body);
    const command = new CreatePresignedUrlCommand({
      presigendRequest: new PresignedRequest({
        ...body,
        uploaderId: request.user.id,
      }),
    });

    this.commandBus.execute(command);
  }
}
