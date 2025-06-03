/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateBikeRequestDto } from '@src/modules/bike/commands/create-bike/create-bike.request.dto';
import { BikeTypes } from '@src/modules/bike/domain/bike.types';
import { setupTestApp } from '../../utils/create-test-app';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { MockJwtAuthGuard } from '../../mocks/mock-auth.guard';
import { UserRoles } from '@src/modules/user/domain/user.types';

let app: INestApplication;
const getApp = setupTestApp();

beforeAll(() => {
  app = getApp();
});

const validPayload: CreateBikeRequestDto = {
  type: BikeTypes.motorbike,
  model: 'Yamaha Fino',
  enginePower: 125,
  pricePerDay: 15.5,
  description: 'Fuel efficient',
  photoKeys: ['uploads/1.jpg'],
  thumbnailKey: 'uploads/1.jpg',
};

describe('CreateBikeController', () => {
  it('should create a bike and return its id', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/bikes')
      .send(validPayload)
      .expect(201);

    expect(res.body).toHaveProperty('id');
  });

  it('should return 400 when required fields are missing', async () => {
    const { model, ...invalidPayload } = validPayload;
    await request(app.getHttpServer())
      .post('/v1/bikes')
      .send(invalidPayload)
      .expect(400);
  });

  it('should return 400 when pricePerDay is negative', async () => {
    await request(app.getHttpServer())
      .post('/v1/bikes')
      .send({
        ...validPayload,
        pricePerDay: -10,
      })
      .expect(400);
  });

  it('should return 400 if thumbnailKey is not in photoKeys', async () => {
    await request(app.getHttpServer())
      .post('/v1/bikes')
      .send({
        ...validPayload,
        thumbnailKey: 'uploads/not-exist.jpg',
      })
      .expect(400);
  });

  it('should be forbidden for customers', async () => {
    MockJwtAuthGuard.user.role = UserRoles.customer;

    await request(app.getHttpServer())
      .post('/v1/bikes')
      .send(validPayload)
      .expect(403);
  });
});
