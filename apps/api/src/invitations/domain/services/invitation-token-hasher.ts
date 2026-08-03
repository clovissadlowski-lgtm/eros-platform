export abstract class InvitationTokenHasher {
  abstract hash(token: string): string;

  abstract compare(
    token: string,
    tokenHash: string,
  ): boolean;
}