import { Map } from 'immutable';
import {
    createStore,
    combineReducers,
    applyMiddleware,
    compose,
} from 'redux';
import thunkMiddleware from 'redux-thunk';

import { Contact } from '../models/Contact';
import { User } from '../models/User';
import { ActionsTypes } from '../actions/Actions';

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
    switch (action.type) {
        case 'CREATE-CONTACT-SEND-REPLY': {
            console.log('Sending: ', action);
            return contacts;
        }
    }
    return contacts;
};

const userReducer = (user: User = defaultUser, action: ActionsTypes): User => {
    switch (action.type) {
        case 'CREATE-USER': {
            return {
                name: action.name,
                identity: {
                    publicKey: 'e8869123ec894bfb8bce8dc3b083ecde6ba16abe3ea7ff2b32ca62eaded164bdf3aae44766c1431477d570378e81cb3fb674ae7dcdcb4257abdd1491f12641b8',
                    privateKey: '0x45e1805a7b6eee384820ac97c90b39c51265ac8e39715fa8d76a4f71fdb90def',
                },
                ephemeralIdentity: {
                    publicKey: '8a6cf93a2f199009db635a03e4d7b8a2fad4c9044ad237aba723e459b32d362d46b9848fa2525df47a502fe68777ab368e5be85f609b756e28afb8620a5551ba',
                    privateKey: '0xc685320e66ad6cdff4ecd5dc842fb24812e2c6dd87558cd28c48d7f1280bd085',
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
