import { NavigationAction } from 'react-navigation';

export type ActionTypes =
    | CreateUserAction
    | CreateContactSendReplyAction
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

export const timeTick = (currentTimestamp: number): TimeTickAction => ({
    type: 'TIME-TICK',
    currentTimestamp,
});
