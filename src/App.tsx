import * as React from 'react';
import { Provider } from 'react-redux';
import { persistStore, Persistor } from 'redux-persist';
import { View, Text, StatusBar, Platform, TouchableWithoutFeedback } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';

import { store } from './reducers/index';
import { HomeScreenContainer } from './containers/HomeScreenContainer';
import { HeaderTitleContainer } from './containers/HeaderTitleContainer';
import * as Actions from './actions/Actions';

interface State {
    rehydrated: boolean;
}

export default class App extends React.Component<{}, State> {
    public state = {
        rehydrated: false,
    };

    private persistor: Persistor | null = null;

    public componentDidMount() {
        const initStore = () => {
            setInterval(() => store.dispatch(Actions.timeTick()), 1000);
            setInterval(() => store.dispatch(Actions.pingContacts()), 30 * 1000);
            setInterval(() => store.dispatch(Actions.cleanupSeenMessages()), 60 * 1000);
            store.dispatch(
                Actions.chainActions([
                    Actions.generateContactRandom(),
                    Actions.connectToNetwork(),
                ],
                () => {
                    this.setState({
                        rehydrated: true,
                    });
                }));
        };

        const persistor = persistStore(store, {}, initStore);
    }

    public render() {
        if (this.state.rehydrated === false) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Loading...</Text>
                </View>
            );
        } else {
            return (
                <Provider store={store}>
                    <HomeScreenContainer/>
                </Provider>
            );
        }
    }
}
