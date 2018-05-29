import { connect } from 'react-redux';

import { AppState } from '../reducers/index';
import { StateProps, DispatchProps, HeaderTitleComponent } from '../components/HeaderTitleComponent';
import * as Actions from '../actions/Actions';
import { Screen } from '../Screen';

const mapStateToProps = (state: AppState, ownProps): StateProps => {
    return {
        screenToShow: state.screen,
    };
};

const mapDispatchToProps = (dispatch): DispatchProps => {
    return {
        onPressSettings: (currentScreen: Screen) => {
            console.log('onPressSettings');
            const nextScreen = currentScreen === 'settings' ? 'home' : 'settings';
            dispatch(Actions.changeScreen(nextScreen));
        },
    };
};

export const HeaderTitleContainer = connect<StateProps, DispatchProps, {}>(
    mapStateToProps,
    mapDispatchToProps,
)(HeaderTitleComponent);
