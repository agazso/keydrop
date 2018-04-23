import * as React from 'react';

import { StackNavigator, TabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text, StatusBar, Platform } from 'react-native';


const Root = TabNavigator(
    {
        Main: {
            screen: ({navigation}) => (<View><Text>Hello</Text></View>),
        },
    },
    {
        tabBarPosition: 'bottom',
        animationEnabled: false,
        swipeEnabled: false,
        navigationOptions: {

        }
    }
);


const Scenes = {
    Root: {
        screen: Root
    },
}

const AppNavigator = StackNavigator(Scenes,
    {
        mode: 'modal',
    }
);

export default class App extends React.Component {

    render() {
        return (
            <AppNavigator />
        );
    }
}
