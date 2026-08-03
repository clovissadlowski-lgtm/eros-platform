import { User } from '../entities/user.entity';

export abstract class UsersRepository {
  abstract create(
    user: User,
  ): Promise<User>;

  abstract findById(
    userId: string,
  ): Promise<User | null>;

  abstract findByEmail(
    email: string,
  ): Promise<User | null>;

  abstract list(): Promise<User[]>;

  abstract update(
    user: User,
  ): Promise<User>;
}
