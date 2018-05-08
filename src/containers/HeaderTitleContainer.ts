import { connect } from 'react-redux';

import { AppState } from '../reducers/index';
import { StateProps, DispatchProps, HeaderTitleComponent } from '../components/HeaderTitleComponent';
import * as Actions from '../actions/Actions';

const mapStateToProps = (state: AppState, ownProps): StateProps => {
    return {
    };
};

const mapDispatchToProps = (dispatch): DispatchProps => {
    return {
        onPressSettings: () => {
            console.log('onPressSettings');
            dispatch(Actions.deleteContacts());
            dispatch(Actions.deleteUser());
        },
    };
};

export const HeaderTitleContainer = connect<StateProps, DispatchProps, {}>(
    mapStateToProps,
    mapDispatchToProps,
)(HeaderTitleComponent);
