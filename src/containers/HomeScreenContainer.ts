import { connect } from 'react-redux';

import { AppState } from '../reducers/index';
import { Contact, isContactOnline } from '../models/Contact';
import { HomeScreen, StateProps, DispatchProps } from '../components/HomeScreen';
import * as Actions from '../actions/Actions';
import { isTimestampValid } from '../validation';
import { Screen } from '../Screen';

const getScreenToShow = (state: AppState): Screen => {
    if (state.screen === 'loading') {
        if (state.user.name !== '') {
            return 'home';
        } else {
            return 'loading';
        }
    }
    if (state.user.name === '') {
        return 'registration';
    }
    return state.screen;
};

const mapStateToProps = (state: AppState, ownProps): StateProps => {
    const contacts = state.contacts.toArray();
    const currentTimestamp = state.currentTimestamp;
    const onlineContacts = contacts.filter(contact => isContactOnline(contact, currentTimestamp));
    const offlineContacts = contacts.filter(contact => !isContactOnline(contact, currentTimestamp));
    const screenToShow = getScreenToShow(state);

    return {
        contacts: onlineContacts.concat(offlineContacts),
        screenToShow,
        user: state.user,
        contactRandom: state.contactRandom,
        serverAddress: state.serverAddress,
    };
};

const mapDispatchToProps = (dispatch): DispatchProps => {
    return {
        onCreateUser: (username: string) => {
            dispatch(Actions.changeScreen('loading'));
            dispatch(Actions.createUser(username));
        },
        onDeleteUser: () => {
            dispatch(Actions.deleteUser());
            dispatch(Actions.deleteContacts());
            dispatch(Actions.changeScreen('registration'));
        },
        onCreateContact: (data: ContactData) => {
            if (isTimestampValid(data.timestamp)) {
                dispatch(Actions.createContact(data.publicKey, data.address, data.random, 'invite-sent'));
                dispatch(Actions.sendInitiateContact(data.publicKey, data.address, data.timestamp, data.random));
            }
        },
        onNotifyContacts: () => {
            dispatch(Actions.cleanupContacts());
        },
        onSend: (publicKey: string, address: string, secret: string) => {
            dispatch(Actions.sendSecret(publicKey, address, secret));
        },
        onCloseSettings: () => {
            console.log('onCloseSettings');
            dispatch(Actions.changeScreen('home'));
        },
        onChangeServerAddress: (serverAddress: string) => {
            dispatch(Actions.changeServerAddress(serverAddress));
        },
    };
};

export const HomeScreenContainer = connect<StateProps, DispatchProps, {}>(
    mapStateToProps,
    mapDispatchToProps,
)(HomeScreen);
