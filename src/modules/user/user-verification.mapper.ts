import { Injectable } from '@nestjs/common';
import { Mapper } from '@src/libs/ddd';
import { UserVerificationEntity } from './domain/user-verification.entity';
import {
  UserVerificationModel,
  userVerificationSchema,
} from './database/adapters/user-verification.repository';
import { UserVerificationResponseDto } from './dtos/user-verification.response.dto';

@Injectable()
export class UserVerificationMapper
  implements
    Mapper<
      UserVerificationEntity,
      UserVerificationModel,
      UserVerificationResponseDto
    >
{
  toPersistence(entity: UserVerificationEntity): UserVerificationModel {
    const copy = entity.getProps();
    const record: UserVerificationModel = {
      id: copy.id,
      code: copy.code,
      target: copy.target,
      createdAt: copy.createdAt,
      expiresAt: copy.expiresAt,
      userId: copy.userId,
      verified: copy.verified,
    };

    return userVerificationSchema.parse(record);
  }

  toDomain(record: UserVerificationModel): UserVerificationEntity {
    const entity = new UserVerificationEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      props: {
        expiresAt: new Date(record.expiresAt),
        code: record.code,
        target: record.target,
        verified: record.verified,
        userId: record.userId,
      },
    });
    return entity;
  }

  toResponse(entity: UserVerificationEntity): UserVerificationResponseDto {
    const response = new UserVerificationResponseDto(entity);
    return response;
  }
}
