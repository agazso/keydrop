export type ContactType = 'person' | 'device';

export type ContactState = 'invite-sent' | 'invite-received' | 'contact';

export interface Contact {
    type: ContactType;
    state: ContactState;
    name: string;
    publicKey: string;
    knownSince: number;
    lastSeen: number;
}
