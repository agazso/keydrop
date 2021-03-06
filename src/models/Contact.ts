export type ContactType = 'person' | 'device';

export type ContactState = 'invite-sent' | 'invite-received' | 'contact';

export interface Contact {
    type: ContactType;
    state: ContactState;
    name: string;
    publicKey: string;
    address: string;
    knownSince: number;
    lastSeen: number;
    lastTransferStarted: number;
}

const OnlineTimestampMillis = 60 * 1000;
export const isContactOnline = (contact: Contact, currentTimestamp: number = Date.now()): boolean => {
    return contact.lastSeen > currentTimestamp - OnlineTimestampMillis
    &&
    contact.state === 'contact'
    ;
};

const KnownTimestampMillis = 5 * 60 * 1000;
export const isContactPersistent = (contact: Contact, currentTimestamp: number = Date.now()): boolean => {
    if (contact.state === 'contact') {
        return true;
    }
    return false;
};

const ActiveTransferTimestampMillis = 60 * 1000;
export const hasContactActiveTransfer = (contact: Contact, currentTimestamp: number = Date.now()): boolean => {
    return contact.lastTransferStarted > currentTimestamp - ActiveTransferTimestampMillis;
};
