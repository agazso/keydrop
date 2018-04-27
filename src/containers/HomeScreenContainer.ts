import { connect } from 'react-redux';

import { AppState } from '../reducers/index';
import { Contact } from '../models/Contact';
import { HomeScreen, StateProps, DispatchProps } from '../components/HomeScreen';
import * as Actions from '../actions/Actions';
import { isTimestampValid } from '../validation';

const mapStateToProps = (state: AppState, ownProps): StateProps => {
    const OnlineTimestampMillis = 60 * 1000;
    const contacts = state.contacts.toArray();
    const onlineContacts = contacts.filter(contact =>
        contact.lastSeen > state.currentTimestamp - OnlineTimestampMillis
        &&
        contact.state === 'contact'
    );

    return {
        contacts: onlineContacts,
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
                dispatch(Actions.createContact(data.publicKey, '', 'invite-sent'));
                dispatch(Actions.sendInitiateContact(data.publicKey, data.timestamp, data.random));
            }
        },
        onNotifyContacts: () => {
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
