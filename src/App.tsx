import * as React from 'react';
import { Provider } from 'react-redux';
import { View, Text, StatusBar, Platform, TouchableWithoutFeedback } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './reducers/index';
import { HomeScreenContainer } from './containers/HomeScreenContainer';
import { HeaderTitleContainer } from './containers/HeaderTitleContainer';
import { NativeModules } from "react-native";

NativeModules.Swarm.show("yolóka")
    .then(value => {
        console.log("returned: " + value);
        setTimeout(() => {
            const ws = new WebSocket("ws://localhost:8546");
            ws.onmessage = (event) => {
                console.log(event.data);
            }
            ws.onopen = () => {
                console.log("connected to node");
                const json = {
                    "jsonrpc": "2.0",
                    "id": 0, // it's for us to keep record of the requests
                    "method": "pss_baseAddr",
                    "params": [],
                };

                ws.send(JSON.stringify(json));
            };

            ws.onerror = (error) => console.log("error connection", error);
        }, 3000);
    });

export default class App extends React.Component {
    public render() {
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <HeaderTitleContainer/>
                    <HomeScreenContainer/>
                </PersistGate>
            </Provider>
        );
    }
}
