import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { TouchableView } from './TouchableView';
import { Colors, IconSize } from '../styles';
import { SimpleTextInput } from './SimpleTextInput';

export interface StateProps {
    serverAddress: string;
}

export interface DispatchProps {
    onDeleteUser: () => void;
    onCloseSettings: () => void;
    onChangeServerAddress: (serverAddress: string) => void;
}

export type Props = StateProps & DispatchProps;

export interface State {
}

const CloseIconName = Platform.OS === 'ios' ? 'ios-close' : 'md-close';

export class Settings extends React.Component<Props, State> {
    public render() {
        return (
            <View style={styles.mainContainer}>
                <SimpleTextInput
                    style={{}}
                    placeholder='Server address'
                    defaultValue={this.props.serverAddress}
                    onChangeText={this.props.onChangeServerAddress}
                />
                <ScrollView style={styles.logContainer} />

                <TouchableView onPress={() => {
                        console.log('onPress: onCloseSettings');
                        this.props.onCloseSettings();
                    }}
                    style={styles.closeButtonContainer}
                >
                    <Ionicon name={CloseIconName} color={Colors.DARK_GRAY} size={IconSize.MEDIUM_LIST_ICON} />
                </TouchableView>

                <TouchableView style={styles.buttonContainer} onPress={this.props.onDeleteUser}>
                    <Text style={styles.deleteText}>Delete user</Text>
                </TouchableView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        height: '100%',
    },
    logContainer: {

    },
    buttonContainer: {
        height: 50,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: Colors.WHITE,
        alignItems: 'center',
    },
    deleteText: {
        color: Colors.ATTENTION,
    },
    closeButtonContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
