import { Alert, AlertButton, Clipboard } from 'react-native';
import { Map as ImmutableMap } from 'immutable';

import { User } from '../models/User';
import { Contact, ContactState, isContactOnline } from '../models/Contact';
import {
    sendInitiateContactMessage,
    sendPingMessage,
    sendSecretMessage,
    sendAckSendMessage,
} from '../network/Network';
import { getUnsecureRandomStrings, generateUnsecureRandomString } from '../random';
import { AppState } from '../reducers';
import { isTimestampValid } from '../validation';
import { Message, MessageEnvelope } from '../network/Message';
import { encryptWithPublicKey } from '../crypto';
import { PrivateIdentity, PublicIdentity } from '../models/Identity';
import { pssGetPublicKey, pssGetBaseAddress, pssConnect } from '../network/pssRpc';
import { rpcConnect } from '../network/JSONRPC';
import { Screen } from '../Screen';
import { cleanupOldMessages, testAndSetMessage } from '../network/MessageCache';

export type ActionTypes =
    | CreateUserWithIdentityAction
    | DeleteUserAction
    | TimeTickAction
    | CreateContactAction
    | UpdateContactNameAction
    | UpdateContactLastSeenAction
    | UpdateContactStateAction
    | UpdateContactLastTransferStartedAction
    | UpdateContactRandomAction
    | CleanupContactsAction
    | DeleteContactsAction
    | ChangeScreenAction
    | ChangeServerAddress
    ;

export interface CreateUserWithIdentityAction {
    type: 'CREATE-USER-WITH-IDENTITY';
    name: string;
    identity: PublicIdentity;
}

export interface DeleteUserAction {
    type: 'DELETE-USER';
}

export interface TimeTickAction {
    type: 'TIME-TICK';
}

export interface CreateContactAction {
    type: 'CREATE-CONTACT';
    publicKey: string;
    address: string;
    name: string;
    state: ContactState;
}

export interface UpdateContactNameAction {
    type: 'UPDATE-CONTACT-NAME';
    publicKey: string;
    name: string;
}

export interface UpdateContactLastSeenAction {
    type: 'UPDATE-CONTACT-LAST-SEEN';
    publicKey: string;
    lastSeen: number;
}

export interface UpdateContactStateAction {
    type: 'UPDATE-CONTACT-STATE';
    publicKey: string;
    state: ContactState;
}

export interface UpdateContactLastTransferStartedAction {
    type: 'UPDATE-CONTACT-LAST-TRANSFER-STARTED';
    publicKey: string;
    lastTransferStarted: number;
}

export interface UpdateContactRandomAction {
    type: 'UPDATE-CONTACT-RANDOM';
    random: string;
}

export interface CleanupContactsAction {
    type: 'CLEANUP-CONTACTS';
}

export interface DeleteContactsAction {
    type: 'DELETE-CONTACTS';
}

export interface ChangeScreenAction {
    type: 'CHANGE-SCREEN';
    screen: Screen;
}

export interface ChangeServerAddress {
    type: 'CHANGE-SERVER-ADDRESS';
    serverAddress: string;
}

export const createUserWithIdentity = (name: string, identity: PublicIdentity): CreateUserWithIdentityAction => ({
    type: 'CREATE-USER-WITH-IDENTITY',
    name,
    identity,
});

export const deleteUser = (): DeleteUserAction => ({
    type: 'DELETE-USER',
});

export const timeTick = (): TimeTickAction => ({
    type: 'TIME-TICK',
});

export const createContact = (publicKey: string, address: string, name: string, state: ContactState): CreateContactAction => ({
    type: 'CREATE-CONTACT',
    publicKey,
    address,
    name,
    state,
});

export const updateContactName = (publicKey: string, name: string): UpdateContactNameAction => ({
    type: 'UPDATE-CONTACT-NAME',
    publicKey,
    name,
});

export const updateContactLastSeen = (publicKey: string, lastSeen: number): UpdateContactLastSeenAction => ({
    type: 'UPDATE-CONTACT-LAST-SEEN',
    publicKey,
    lastSeen,
});

export const updateContactState = (publicKey: string, state: ContactState): UpdateContactStateAction => ({
    type: 'UPDATE-CONTACT-STATE',
    publicKey,
    state,
});

export const updateContactLastTransferStarted = (publicKey: string, lastTransferStarted: number): UpdateContactLastTransferStartedAction => ({
    type: 'UPDATE-CONTACT-LAST-TRANSFER-STARTED',
    publicKey,
    lastTransferStarted,
});

export const updateContactRandom = (random: string): UpdateContactRandomAction => ({
    type: 'UPDATE-CONTACT-RANDOM',
    random,
});

export const cleanupContacts = (): CleanupContactsAction => ({
    type: 'CLEANUP-CONTACTS',
});

export const deleteContacts = (): DeleteContactsAction => ({
    type: 'DELETE-CONTACTS',
});

export const changeScreen = (screen: Screen): ChangeScreenAction => ({
    type: 'CHANGE-SCREEN',
    screen,
});

export const changeServerAddress = (serverAddress: string): ChangeServerAddress => ({
    type: 'CHANGE-SERVER-ADDRESS',
    serverAddress,
});

export const createUser = (name: string) => {
    return async (dispatch, getState: () => AppState) => {
        const publicKey = await pssGetPublicKey();
        const address = await pssGetBaseAddress();
        const identity: PublicIdentity = {
            publicKey,
            address,
        };
        dispatch(createUserWithIdentity(name, identity));
        dispatch(pingSelf());
    };
};

export const cleanupSeenMessages = () => {
    return async (dispatch, getState: () => AppState) => {
        const currentTimestamp = getState().currentTimestamp;
        cleanupOldMessages(currentTimestamp - 5 * 60 * 1000);
    };
};

export const receiveMessageEnvelope = (envelope: MessageEnvelope) => {
    return async (dispatch, getState: () => AppState) => {
        const message = JSON.parse(envelope.payload) as Message;

        if (message.messageId != null) {
            const hasSeenMessage = testAndSetMessage(message.messageId, getState().currentTimestamp);
            if (hasSeenMessage) {
                return;
            }
        }

        const state = getState();
        switch (message.type) {
            case 'ping': {
                const contacts = state.contacts;
                if (contacts.has(message.publicKey)) {
                    const contact = contacts.get(message.publicKey);
                    if (!isContactOnline(contact)) {
                        dispatch(pingContact(contact.publicKey, contact.address));
                    }
                    dispatch(updateContactLastSeen(contact.publicKey, Date.now()));
                    if (contact.state === 'invite-received') {
                        dispatch(updateContactState(contact.publicKey, 'contact'));
                    }
                }
                return;
            }
            case 'initiate-contact': {
                const contactRandom = state.contactRandom;

                if (isTimestampValid(message.timestamp) === false) {
                    console.error('timestamp not valid', Date.now(), message.timestamp);
                    return;
                }

                if (state.contacts.has(message.publicKey)) {
                    const contact = state.contacts.get(message.publicKey);
                    if (contact.state !== 'invite-sent') {
                        return;
                    }

                    dispatch(updateContactName(contact.publicKey, message.name));
                    dispatch(updateContactLastSeen(contact.publicKey, Date.now()));
                    dispatch(updateContactState(contact.publicKey, 'contact'));
                    dispatch(pingContact(contact.publicKey, contact.address));
                    return;
                }

                if (contactRandom !== message.random) {
                    console.error('contactRandom mismatch', contactRandom, message.random);
                    return;
                }

                dispatch(createContact(message.publicKey, message.address, message.name, 'invite-received'));
                dispatch(sendInitiateContact(message.publicKey, message.address, message.timestamp, message.random));
                return;
            }
            case 'secret': {
                if (state.contacts.has(message.publicKey)) {
                    const contact = state.contacts.get(message.publicKey)!;
                    await sendAckSendMessage(contact.publicKey, contact.address, state.user.identity.publicKey, message.id);
                }
                const contactName = getContactName(state.contacts, message.publicKey);
                const buttons: AlertButton[] = [
                    {
                        text: 'Copy',
                        onPress: () => Clipboard.setString(message.message),
                    },
                    {
                        text: 'Show',
                        onPress: () => showSecretDialog(message.message),
                    },
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                ];
                const from = contactName === '' ? '' : ' from ' + contactName;
                Alert.alert('Secret arrived' + from, 'Copy to clipboard or show', buttons);
                return;
            }
            case 'ack-send': {
                const contacts = state.contacts;
                if (contacts.has(message.publicKey)) {
                    const contact = contacts.get(message.publicKey)!;
                    dispatch(updateContactLastTransferStarted(contact.publicKey, 0));
                }
                return;
            }
        }
    };
};

const getContactName = (contacts: ImmutableMap<string, Contact>, publicKey: string): string => {
    if (contacts.has(publicKey)) {
        return contacts.get(publicKey)!.name;
    }
    return '';
};

const showSecretDialog = (secret: string) => {
    const buttons: AlertButton[] = [
        {
            text: 'Copy',
            onPress: () => Clipboard.setString(secret),
        },
        {
            text: 'Cancel',
            style: 'cancel',
        },
    ];
    Alert.alert('Secret is: ' + secret, 'Copy to clipboard', buttons);
    return;
};

export const connectToNetwork = () => {
    return async (dispatch, getState: () => AppState) => {
        const serverAddress = getState().serverAddress;
        await pssConnect(serverAddress, {
            onOpen: () => {
                dispatch(pingContacts());
            },
            onMessage: (message: string) => {
                console.log('onMessage: ', message);
                const envelope: MessageEnvelope = {
                    recipient: '',
                    sender: '',
                    payload: message,
                };
                dispatch(receiveMessageEnvelope(envelope));
            },
        });
    };
};

export const sendInitiateContact = (publicKey: string, address: string, timestamp: number, random: string) => {
    return async (dispatch, getState: () => AppState) => {
        const user = getState().user;
        const ownPublicKey = user.identity.publicKey;
        const ownAddress = user.identity.address;
        return sendInitiateContactMessage(
                publicKey,
                address,
                ownPublicKey,
                ownAddress,
                timestamp,
                random,
                user.name,
        );
    };
};

export const pingContacts = () => {
    return async (dispatch, getState: () => AppState) => {
        const user = getState().user;
        const ownPublicKey = user.identity.publicKey;
        const contacts = getState().contacts.toArray();
        const sendMessages = contacts.map(
            (contact, index) => {
                sendPingMessage(contact.publicKey, contact.address, ownPublicKey);
            }
        );

        return Promise.all(sendMessages);
    };
};

export const pingContact = (recipientPublicKey: string, recipientAddress: string) => {
    return async (dispatch, getState: () => AppState) => {
        const user = getState().user;
        const ownPublicKey = user.identity.publicKey;
        return sendPingMessage(recipientPublicKey, recipientAddress, ownPublicKey);
    };
};

export const pingSelf = () => {
    return async (dispatch, getState: () => AppState) => {
        const user = getState().user;
        const ownPublicKey = user.identity.publicKey;
        const ownAddress = user.identity.address;
        return sendPingMessage(ownPublicKey, ownAddress, ownPublicKey);
    };
};

export const generateContactRandom = () => {
    return async (dispatch, getState: () => AppState) => {
        const random = await generateUnsecureRandomString(32);
        dispatch(updateContactRandom(random));
    };
};

export const sendSecret = (publicKey: string, address: string, data: string) => {
    return async (dispatch, getState: () => AppState) => {
        const user = getState().user;
        const ownPublicKey = user.identity.publicKey;
        console.log('Sending data', publicKey, data);
        await sendSecretMessage(publicKey, address, ownPublicKey, data);
        dispatch(updateContactLastTransferStarted(publicKey, Date.now()));
    };
};

type Thunk = (dispatch: any, getState: () => AppState) => Promise<void>;
type ThunkTypes = Thunk | ActionTypes;

const isActionTypes = (t: ThunkTypes): t is ActionTypes => {
    return (t as ActionTypes).type !== undefined;
};

export const chainActions = (thunks: ThunkTypes[], callback?: () => void) => {
    return async (dispatch, getState: () => AppState) => {
        for (const thunk of thunks) {
            if (isActionTypes(thunk)) {
                dispatch(thunk);
            } else {
                await thunk(dispatch, getState);
            }
        }
        if (callback != null) {
            callback();
        }
    };
};
