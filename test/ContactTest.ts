import { Contact, isContactPersistent } from '../src/models/Contact';

it('should test if contact is persistent', () => {
    const contact: Contact = {
        type: 'person',
        state: 'contact',
        name: 'Alice',
        publicKey: '0xPUBKEY',
        address: '',
        knownSince: 0,
        lastSeen: 0,
        lastTransferStarted: 0,
    };

    const result = isContactPersistent(contact);
    expect(result).toBeTruthy();
});

it('should test if contact is not persistent', () => {
    const contact: Contact = {
        type: 'person',
        state: 'invite-sent',
        name: 'Alice',
        publicKey: '0xPUBKEY',
        address: '',
        knownSince: 0,
        lastSeen: 0,
        lastTransferStarted: 0,
    };

    const result = isContactPersistent(contact);
    expect(result).toBeFalsy();
});
