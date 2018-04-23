import { Map } from 'immutable';
import {
    createStore,
    combineReducers,
    applyMiddleware,
    compose,
} from 'redux';
import thunkMiddleware from 'redux-thunk';

import { Contact } from '../models/Contact';

export interface AppState {
    contacts: Map<number, Contact>;
}

interface Contacts {
    [key: number]: Contact;
}

const defaultContacts = Map<number, Contact>({
    1: {
        _id: 1,
        type: 'device',
        name: 'Attila\'s iPhone',
        publicKey: '0x',
        knownSince: 0,
        lastSeen: 0,
    },
    2: {
        _id: 2,
        type: 'person',
        name: 'Mark',
        publicKey: '0x',
        knownSince: 0,
        lastSeen: 0,
    },
});

const defaultState: AppState = {
    contacts: defaultContacts,
};
const contactsReducer = (contacts: Map<number, Contact> = defaultContacts, action: any): Map<number, Contact> => {
    return contacts;
};

export const reducer = combineReducers<AppState>({
    contacts: contactsReducer,
});

export const store = createStore(
    reducer,
    defaultState,
    compose(
        applyMiddleware(thunkMiddleware)
    )
);
store.subscribe(() => console.log(store.getState()));
