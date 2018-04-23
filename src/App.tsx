import * as React from 'react';
import { Provider } from 'react-redux';
import { StackNavigator, TabNavigator, NavigationRouteConfigMap } from 'react-navigation';
import { View, Text, StatusBar, Platform } from 'react-native';

import { store } from './reducers/index';
import { HomeScreenContainer } from './containers/HomeScreenContainer';

const AppNavigator = StackNavigator(
    {
        HomeScreen: { screen: HomeScreenContainer},
    },
    {
        navigationOptions: {
            headerTitle: <Text>Keydrop</Text>,
        },
    },
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
