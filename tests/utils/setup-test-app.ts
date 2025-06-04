import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { JwtAuthGuard } from '@src/modules/auth/libs/guard/jwt-auth-guard';
import { MockJwtAuthGuard } from '../mocks/mock-auth.guard';
import * as cookieParser from 'cookie-parser';

export function setupTestApp(timeout = 10000) {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockJwtAuthGuard)
      .compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    await app.init();
  }, timeout);

  afterAll(async () => {
    await app?.close();
  });

  return () => app;
}
