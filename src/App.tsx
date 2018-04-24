import * as React from 'react';
import { Provider } from 'react-redux';
import { StackNavigator, TabNavigator, NavigationRouteConfigMap } from 'react-navigation';
import { View, Text, StatusBar, Platform, TouchableWithoutFeedback } from 'react-native';

import { store } from './reducers/index';
import { HomeScreenContainer } from './containers/HomeScreenContainer';

const onPress = () => {
    // TODO scroll to top
};

const HeaderTitleComponent = (props) =>
    <TouchableWithoutFeedback onPress={onPress}>
        <View>
            <Text>Keydrop</Text>
        </View>
    </TouchableWithoutFeedback>;

const AppNavigator = StackNavigator(
    {
        HomeScreen: { screen: HomeScreenContainer},
    },
    {
        navigationOptions: {
            headerTitle: <HeaderTitleComponent/>,
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
