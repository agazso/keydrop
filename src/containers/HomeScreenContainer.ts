import { connect } from 'react-redux';

import { AppState } from '../reducers/index';
import { Contact, isContactOnline } from '../models/Contact';
import { HomeScreen, StateProps, DispatchProps } from '../components/HomeScreen';
import * as Actions from '../actions/Actions';
import { isTimestampValid } from '../validation';

const mapStateToProps = (state: AppState, ownProps): StateProps => {
    const contacts = state.contacts.toArray();
    const currentTimestamp = state.currentTimestamp;
    const onlineContacts = contacts.filter(contact => isContactOnline(contact, currentTimestamp));
    const offlineContacts = contacts.filter(contact => !isContactOnline(contact, currentTimestamp));

    return {
        contacts: onlineContacts.concat(offlineContacts),
        alreadyHasKey: state.user.name !== '',
        user: state.user,
        contactRandom: state.contactRandom,
    };
};

const mapDispatchToProps = (dispatch): DispatchProps => {
    return {
        onCreateUser: (username: string) => {
            dispatch(Actions.createUser(username));
        },
        onCreateContact: (data: ContactData) => {
            if (isTimestampValid(data.timestamp)) {
                dispatch(Actions.createContact(data.publicKey, data.address, '', 'invite-sent'));
                dispatch(Actions.sendInitiateContact(data.publicKey, data.timestamp, data.random));
            }
        },
        onNotifyContacts: () => {
            dispatch(Actions.cleanupContacts());
            dispatch(Actions.connectToNetwork());
        },
        onSend: (publicKey: string, secret: string) => {
            dispatch(Actions.sendData(publicKey, secret));
        },
    };
};

export const HomeScreenContainer = connect<StateProps, DispatchProps, {}>(
    mapStateToProps,
    mapDispatchToProps,
)(HomeScreen);
