import { connect } from 'react-redux';

import { AppState } from '../reducers/index';
import { Contact } from '../models/Contact';
import { HomeScreen, StateProps, DispatchProps } from '../components/HomeScreen';

import * as Actions from '../actions/Actions';

const mapStateToProps = (state: AppState, ownProps): StateProps => {
    return {
        contacts: state.contacts.toArray(),
        alreadyHasKey: state.user.name !== '',
    };
};

const mapDispatchToProps = (dispatch): DispatchProps => {
    return {
        createUser: (username: string) => {
            dispatch(Actions.createUser(username));
        },
    };
};

export const HomeScreenContainer = connect<StateProps, DispatchProps, {}>(
    mapStateToProps,
    mapDispatchToProps,
)(HomeScreen);
