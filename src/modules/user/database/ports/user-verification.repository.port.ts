import { RepositoryPort } from '@src/libs/ddd';
import { UserVerificationEntity } from '../../domain/user-verification.entity';

export interface UserVerificationRepositoryPort
  extends RepositoryPort<UserVerificationEntity> {
  findOneByCode(code: string): Promise<UserVerificationEntity | null>;

  findOneByTarget(target: string): Promise<UserVerificationEntity | null>;

  findOneByUserId(userId: string): Promise<UserVerificationEntity | null>;
}
