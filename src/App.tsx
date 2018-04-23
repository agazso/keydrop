import * as React from 'react';
import {
    createStore,
    combineReducers,
    applyMiddleware,
    compose,
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import { StackNavigator, TabNavigator, NavigationRouteConfigMap } from 'react-navigation';
import { View, Text, StatusBar, Platform } from 'react-native';

interface AppState {
}

export const appStateReducer = (state: AppState = {}, action: any): AppState => {
    return state;
};

const defaultState: AppState = {};
const reducer = combineReducers<AppState>({appStateReducer});
const store = createStore(
    reducer,
    defaultState,
    compose(
        applyMiddleware(thunkMiddleware)
    )
);
store.subscribe(() => console.log(store.getState()));

const HomeScreen = (props) => <View><Text>Hello</Text></View>;

const AppNavigator = StackNavigator(
    {
        HomeScreen: { screen: HomeScreen},
    }
);

export default class App extends React.Component {
    public render() {
        return (
            <Provider store={store}>
                <AppNavigator />
            </Provider>
        );
    }
}
