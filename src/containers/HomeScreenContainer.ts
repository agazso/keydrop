import { connect } from 'react-redux';

import { AppState } from '../reducers/index';
import { Contact } from '../models/Contact';
import { HomeScreen, StateProps, DispatchProps } from '../components/HomeScreen';

import * as Actions from '../actions/Actions';

const mapStateToProps = (state: AppState, ownProps): StateProps => {
    return {
        contacts: state.contacts.toArray(),
        alreadyHasKey: state.user.name !== '',
        user: state.user,
    };
};

const isTimestampValid = (timestamp: number, now: number = Date.now()): boolean => {
    const TimestampValidityMillis = 60 * 1000;
    return timestamp + TimestampValidityMillis < now;
}

const mapDispatchToProps = (dispatch): DispatchProps => {
    return {
        onCreateUser: (username: string) => {
            dispatch(Actions.createUser(username));
        },
        onCreateContact: (data: ContactData) => {
            if (isTimestampValid(data.timestamp)) {
                dispatch(Actions.createContactSendReply(data.publicKey, data.timestamp, data.random));
            }
        },
    };
};

export const HomeScreenContainer = connect<StateProps, DispatchProps, {}>(
    mapStateToProps,
    mapDispatchToProps,
)(HomeScreen);
