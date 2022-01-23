import { ITrackbackAccount } from './ITrackbackAccount';
import { ITrustAllianceAgent } from ".";

export interface ITrustAllianceContext {
  agent: ITrustAllianceAgent;
  account: ITrackbackAccount;
}
