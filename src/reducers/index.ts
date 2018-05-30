import { Map } from 'immutable';
import {
    createStore,
    combineReducers,
    applyMiddleware,
    compose,
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native
import * as immutableTransform from 'redux-persist-transform-immutable';
import { AsyncStorage } from 'react-native';

import { Contact, isContactPersistent } from '../models/Contact';
import { User } from '../models/User';
import {
    ActionTypes,
    timeTick,
    generateContactRandom,
    cleanupContacts,
    updateContactLastSeen,
    pingContacts,
    connectToNetwork,
} from '../actions/Actions';
import { generateRandomString } from '../random';
import { Screen } from '../Screen';

export interface AppState {
    contacts: Map<string, Contact>;
    user: User;
    currentTimestamp: number;
    contactRandom: string;
    screen: Screen;
    serverAddress: string;
}

interface Contacts {
    [key: number]: Contact;
}

const now = Date.now();
const Sec = 1000;
const defaultContacts = Map<string, Contact>({
});

const defaultUser: User = {
    name: '',
    identity: {
        publicKey: '',
        address: '',
    },
};

const defaultState: AppState = {
    contacts: defaultContacts,
    user: defaultUser,
    currentTimestamp: Date.now(),
    contactRandom: '',
    screen: 'home',
    serverAddress: '192.168.1.3:8546',
};

const contactsReducer = (contacts: Map<string, Contact> = defaultContacts, action: ActionTypes): Map<string, Contact> => {
    switch (action.type) {
        case 'UPDATE-CONTACT-LAST-SEEN': {
            const contact = contacts.get(action.publicKey);
            const updatedContact = {
                ...contact,
                lastSeen: action.lastSeen,
            };
            return contacts.set(updatedContact.publicKey, updatedContact);
        }
        case 'UPDATE-CONTACT-NAME': {
            const contact = contacts.get(action.publicKey);
            const updatedContact = {
                ...contact,
                name: action.name,
            };
            return contacts.set(updatedContact.publicKey, updatedContact);
        }
        case 'UPDATE-CONTACT-STATE': {
            const contact = contacts.get(action.publicKey);
            const updatedContact = {
                ...contact,
                state: action.state,
            };
            return contacts.set(updatedContact.publicKey, updatedContact);
        }
        case 'UPDATE-CONTACT-LAST-TRANSFER-STARTED': {
            const contact = contacts.get(action.publicKey);
            const updatedContact = {
                ...contact,
                lastTransferStarted: action.lastTransferStarted,
            };
            return contacts.set(updatedContact.publicKey, updatedContact);
        }
        case 'CREATE-CONTACT': {
            const contact: Contact = {
                type: 'person',
                name: action.name,
                state: action.state,
                publicKey: action.publicKey,
                address: action.address,
                lastSeen: Date.now(),
                knownSince: Date.now(),
                lastTransferStarted: 0,
            };
            return contacts.set(contact.publicKey, contact);
        }
        case 'CLEANUP-CONTACTS': {
            const persistentContacts = contacts
                .filter(contact => isContactPersistent(contact!))
                .map(contact => {
                    return {
                        ...contact!,
                        lastTransferStarted: 0,
                    };
                })
                .toMap();
            console.log('persistentContacts: ', persistentContacts);
            return persistentContacts;
        }
        case 'DELETE-CONTACTS': {
            return defaultContacts;
        }
    }
    return contacts;
};

const testUserAlice: User = {
    name: 'Alice',
    identity: {
        publicKey: 'e8869123ec894bfb8bce8dc3b083ecde6ba16abe3ea7ff2b32ca62eaded164bdf3aae44766c1431477d570378e81cb3fb674ae7dcdcb4257abdd1491f12641b8',
        // privateKey: '0x45e1805a7b6eee384820ac97c90b39c51265ac8e39715fa8d76a4f71fdb90def',
        address: '0x6d74809A42a20a3695ea5F5585360A60677DFBed',
    },
};

export const testUserBob: User = {
    name: 'Bob',
    identity: {
        publicKey: '8a6cf93a2f199009db635a03e4d7b8a2fad4c9044ad237aba723e459b32d362d46b9848fa2525df47a502fe68777ab368e5be85f609b756e28afb8620a5551ba',
        // privateKey: '0xc685320e66ad6cdff4ecd5dc842fb24812e2c6dd87558cd28c48d7f1280bd085',
        address: '0xADc9b12480cE9880D6Bed1Ef91Cdc279D671Cf0d',
    },
};

const userReducer = (user: User = defaultUser, action: ActionTypes): User => {
    switch (action.type) {
        case 'CREATE-USER-WITH-IDENTITY': {
            const name = action.name.toLowerCase();
            if (name === testUserAlice.name.toLowerCase()) {
                return testUserAlice;
            }
            if (name === testUserBob.name.toLowerCase()) {
                return testUserBob;
            }
            return {
                name: action.name,
                identity: {
                    publicKey: action.identity.publicKey,
                    // privateKey: action.identity.privateKey,
                    address: action.identity.address,
                },
            };
        }
        case 'DELETE-USER': {
            return defaultUser;
        }
    }
    return user;
};

const currentTimestampReducer = (currentTimestamp: number = Date.now(), action: ActionTypes): number => {
    switch (action.type) {
        case 'TIME-TICK': {
            const timestamp = Date.now();
            return timestamp;
        }
    }
    return currentTimestamp;
};

const contactRandomReducer = (contactRandom: string = '', action: ActionTypes): string => {
    switch (action.type) {
        case 'UPDATE-CONTACT-RANDOM': {
            return action.random;
        }
    }
    return contactRandom;
};

const screenReducer = (screen: Screen = 'home', action: ActionTypes): Screen => {
    switch (action.type) {
        case 'CHANGE-SCREEN': {
            return action.screen;
        }
    }
    return screen;
};

const serverAddressReducer = (serverAddress = '', action: ActionTypes): string => {
    switch (action.type) {
        case 'CHANGE-SERVER-ADDRESS': {
            return action.serverAddress;
        }
    }
    return serverAddress;
};

export const reducer = combineReducers<AppState>({
    contacts: contactsReducer,
    user: userReducer,
    currentTimestamp: currentTimestampReducer,
    contactRandom: contactRandomReducer,
    screen: screenReducer,
    serverAddress: serverAddressReducer,
});

const persistConfig = {
    transforms: [immutableTransform({
        whitelist: ['contacts'],
    })],
    blacklist: ['currentTimestamp', 'contactRandom', 'screen'],
    key: 'root',
    storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, reducer) as any;

export const store = createStore(
    persistedReducer,
    defaultState,
    compose(
        applyMiddleware(thunkMiddleware),
    ),
);

const initStore = () => {
    setInterval(() => store.dispatch(timeTick()), 1000);
    setInterval(() => store.dispatch(pingContacts()), 30 * 1000);
    store.dispatch(connectToNetwork());
    store.dispatch(generateContactRandom());
};

export const persistor = persistStore(store, {}, initStore);

console.log('store: ', store.getState());
store.subscribe(() => console.log(store.getState()));
