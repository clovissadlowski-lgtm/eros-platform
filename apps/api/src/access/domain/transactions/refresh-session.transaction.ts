import { Session } from '../entities/session.entity';

export interface RotateRefreshSessionInput {
  session: Session;
  expectedRefreshTokenHash: string;
  now: string;
}

export abstract class RefreshSessionTransaction {
  abstract execute(
    input: RotateRefreshSessionInput,
  ): Promise<Session | null>;
}