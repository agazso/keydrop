import { PrivateIdentity, PublicIdentity } from './Identity';

export interface User {
    name: string;
    identity: PublicIdentity;
}
