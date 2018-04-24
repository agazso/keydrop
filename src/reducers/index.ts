import { Map } from 'immutable';
import {
    createStore,
    combineReducers,
    applyMiddleware,
    compose,
} from 'redux';
import thunkMiddleware from 'redux-thunk';

import { Contact } from '../models/Contact';
import { PrivateIdentity } from '../models/Identity';
import { ActionsTypes } from '../actions/Actions';

interface User {
    name: string;
    identity: PrivateIdentity;
    ephemeralIdentity?: PrivateIdentity;
}

export interface AppState {
    contacts: Map<number, Contact>;
    user: User;
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
    3: {
        _id: 3,
        type: 'person',
        name: 'Dr. Zoidberg',
        publicKey: '0x',
        knownSince: 0,
        lastSeen: 0,
    },
    4: {
        _id: 4,
        type: 'person',
        name: 'Bruce Wayne',
        publicKey: '0x',
        knownSince: 0,
        lastSeen: 0,
    },
    5: {
        _id: 5,
        type: 'person',
        name: 'Elliot Anderson',
        publicKey: '0x',
        knownSince: 0,
        lastSeen: 0,
    },
    6: {
        _id: 6,
        type: 'device',
        name: 'Macbook Pro',
        publicKey: '0x',
        knownSince: 0,
        lastSeen: 0,
    },
});

const defaultUser: User = {
    name: '',
    identity: {
        publicKey: '',
        privateKey: '',
    },
};

const defaultState: AppState = {
    contacts: defaultContacts,
    user: defaultUser,
};
const contactsReducer = (contacts: Map<number, Contact> = defaultContacts, action: ActionsTypes): Map<number, Contact> => {
    return contacts;
};

const userReducer = (user: User = defaultUser, action: ActionsTypes): User => {
    switch (action.type) {
        case 'CREATE-USER': {
            return {
                name: action.name,
                identity: {
                    publicKey: '0x',
                    privateKey: '0x',
                },
            };
        }
    }
    return user;
};

export const reducer = combineReducers<AppState>({
    contacts: contactsReducer,
    user: userReducer,
});

export const store = createStore(
    reducer,
    defaultState,
    compose(
        applyMiddleware(thunkMiddleware),
    ),
);
store.subscribe(() => console.log(store.getState()));
