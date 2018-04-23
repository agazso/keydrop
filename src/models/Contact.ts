import { Id } from './Id';

export type ContactType = 'person' | 'device';

export interface Contact extends Id {
    type: ContactType;
    name: string;
    publicKey: string;
    knownSince: number;
    lastSeen: number;
}
