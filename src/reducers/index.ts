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
import { ActionTypes, timeTick } from '../actions/Actions';

export interface AppState {
    contacts: Map<number, Contact>;
    user: User;
    currentTimestamp: number;
}

interface Contacts {
    [key: number]: Contact;
}

const now = Date.now();
const Sec = 1000;
const defaultContacts = Map<number, Contact>({
    1: {
        _id: 1,
        type: 'device',
        name: 'Attila\'s iPhone',
        publicKey: '0xPKATTILASIPHONE',
        knownSince: 0,
        lastSeen: now + 30 * Sec,
    },
    2: {
        _id: 2,
        type: 'person',
        name: 'Mark',
        publicKey: '0xMARK',
        knownSince: 0,
        lastSeen: now + 20 * Sec,
    },
    3: {
        _id: 3,
        type: 'person',
        name: 'Dr. Zoidberg',
        publicKey: '0xDRZOIDBERG',
        knownSince: 0,
        lastSeen: now + 10 * Sec,
    },
    4: {
        _id: 4,
        type: 'person',
        name: 'Bruce Wayne',
        publicKey: '0xBRUCEWAYNE',
        knownSince: 0,
        lastSeen: 0,
    },
    5: {
        _id: 5,
        type: 'person',
        name: 'Elliot Anderson',
        publicKey: '0xELLIOTANDERSON',
        knownSince: 0,
        lastSeen: 0,
    },
    6: {
        _id: 6,
        type: 'device',
        name: 'Macbook Pro',
        publicKey: '0xMACBOOKPRO',
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
    currentTimestamp: Date.now(),
};

const contactsReducer = (contacts: Map<number, Contact> = defaultContacts, action: ActionTypes): Map<number, Contact> => {
    switch (action.type) {
        case 'CREATE-CONTACT-SEND-REPLY': {
            console.log('Sending: ', action);
            return contacts;
        }
    }
    return contacts;
};

const userReducer = (user: User = defaultUser, action: ActionTypes): User => {
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

const currentTimestampReducer = (currentTimestamp: number = Date.now(), action: ActionTypes): number => {
    switch (action.type) {
        case 'TIME-TICK': {
            return action.currentTimestamp;
        }
    }
    return currentTimestamp;
};

export const reducer = combineReducers<AppState>({
    contacts: contactsReducer,
    user: userReducer,
    currentTimestamp: currentTimestampReducer,
});

export const store = createStore(
    reducer,
    defaultState,
    compose(
        applyMiddleware(thunkMiddleware),
    ),
);
store.subscribe(() => console.log(store.getState()));

setInterval(() => {
    store.dispatch(timeTick(Date.now()));
}, 1000);
