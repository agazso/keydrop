import { PrivateIdentity } from './Identity';

export interface User {
    name: string;
    identity: PrivateIdentity;
    ephemeralIdentity?: PrivateIdentity;
}
