import { AggregateId, AggregateRoot } from '@src/libs/ddd';
import { CreateSessionProps, SessionProps } from './auth.types';
import { randomUUID } from 'crypto';

export class SessionEntity extends AggregateRoot<SessionProps> {
  protected readonly _id: AggregateId;

  static create(create: CreateSessionProps) {
    const id = randomUUID();
    const props: SessionProps = { ...create };
    const session = new SessionEntity({ id, props });

    return session;
  }

  public validate(): void {}
}
