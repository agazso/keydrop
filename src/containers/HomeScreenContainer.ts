import { connect } from 'react-redux';

import { AppState } from '../reducers/index';
import { Contact } from '../models/Contact';
import { HomeScreen } from '../components/HomeScreen';

interface StateProps {
    contacts: Contact[];
}

interface DispatchProps {
}

const mapStateToProps = (state: AppState, ownProps): StateProps => {
    return {
        contacts: state.contacts.toArray(),
    };
};

const mapDispatchToProps = (dispatch): DispatchProps => {
    return {
    };
};

export const HomeScreenContainer = connect<StateProps, DispatchProps, {}>(
    mapStateToProps,
    mapDispatchToProps,
)(HomeScreen);
