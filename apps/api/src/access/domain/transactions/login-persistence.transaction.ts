import { Session } from '../entities/session.entity';
import { User } from '../../../users/domain/entities/user.entity';

export interface PersistLoginInput {
  user: User;
  session: Session;
}

export interface PersistLoginResult {
  user: User;
  session: Session;
}

export abstract class LoginPersistenceTransaction {
  abstract execute(
    input: PersistLoginInput,
  ): Promise<PersistLoginResult>;
}