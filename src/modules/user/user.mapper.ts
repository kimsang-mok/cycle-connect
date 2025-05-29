import { Injectable } from '@nestjs/common';
import { Mapper } from '@src/libs/ddd';
import { UserEntity } from './domain/user.entity';
import { UserModel, userSchema } from './database/user.schema';
import { UserResponseDto } from './dtos/user.response.dto';
import { Email } from './domain/value-objects/email.value-object';
import { Password } from './domain/value-objects/password.value-object';

@Injectable()
export class UserMapper
  implements Mapper<UserEntity, UserModel, UserResponseDto>
{
  toPersistence(entity: UserEntity): UserModel {
    const copy = entity.getProps();
    const record: UserModel = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      email: copy.email.unpack(),
      password: copy.password.unpack(),
      role: copy.role,
    };
    return userSchema.parse(record);
  }

  toDomain(record: UserModel): UserEntity {
    const entity = new UserEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        email: new Email(record.email),
        password: Password.fromHashed(record.password),
        role: record.role,
      },
    });
    return entity;
  }

  toResponse(entity: UserEntity): UserResponseDto {
    const props = entity.getProps();
    const response = new UserResponseDto(entity);
    response.email = props.email?.unpack();
    return response;
  }

  /* ^ Data returned to the user is whitelisted to avoid leaks.
     If a new property is added, like password or a
     credit card number, it won't be returned
     unless you specifically allow this.
     (avoid blacklisting, which will return everything
      but blacklisted items, which can lead to a data leak).
  */
}
