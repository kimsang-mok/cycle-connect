/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExecutionContext, Injectable } from '@nestjs/common';

import { createJwtGuard } from './jwt-base-guard';

@Injectable()
export class JwtAuthGuard extends createJwtGuard('jwt') {}
