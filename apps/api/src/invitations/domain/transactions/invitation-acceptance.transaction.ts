import { Invitation } from '../entities/invitation.entity';
import { Membership } from '../../../users/domain/entities/membership.entity';
import { User } from '../../../users/domain/entities/user.entity';

export interface AcceptInvitationTransactionInput {
  invitation: Invitation;
  user: User;
  membership: Membership;
}

export interface AcceptInvitationTransactionResult {
  invitation: Invitation;
  user: User;
  membership: Membership;
}

export abstract class InvitationAcceptanceTransaction {
  abstract execute(
    input: AcceptInvitationTransactionInput,
  ): Promise<AcceptInvitationTransactionResult>;
}