import { NavigationAction } from 'react-navigation';
import { User } from '../models/User';
import { Contact } from '../models/Contact';
import { sendMessage } from '../network/Network';
import { getRandomStrings } from '../random';
import { AppState } from '../reducers';

export type ActionTypes =
    | CreateUserAction
    | CreateContactSendReplyAction
    | NotifyContactsAction
    | TimeTickAction
    ;

export interface CreateUserAction {
    type: 'CREATE-USER';
    name: string;
}

export interface CreateContactSendReplyAction {
    type: 'CREATE-CONTACT-SEND-REPLY';
    publicKey: string;
    timestamp: number;
    random: string;
}

export interface NotifyContactsAction {
    type: 'NOTIFY-CONTACTS';
}

export interface TimeTickAction {
    type: 'TIME-TICK';
    currentTimestamp: number;
}

export const createUser = (name: string): CreateUserAction => ({
    type: 'CREATE-USER',
    name,
});

export const createContactSendReply = (publicKey: string, timestamp: number, random: string): CreateContactSendReplyAction => ({
    type: 'CREATE-CONTACT-SEND-REPLY',
    publicKey,
    timestamp,
    random,
});

export const notifyContacts = () => {
    return async (dispatch, getState: () => AppState) => {
        const user = getState().user;
        const contacts = getState().contacts.toArray();
        const randoms = await getRandomStrings(contacts.length);
        const sendMessages = contacts.map(
            (contact, index) => sendMessage(contact.publicKey, randoms[index]));

        return Promise.all(sendMessages);
    };
};

export const timeTick = (currentTimestamp: number): TimeTickAction => ({
    type: 'TIME-TICK',
    currentTimestamp,
});
