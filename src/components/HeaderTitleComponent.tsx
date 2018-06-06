import * as React from 'react';
import { View, Text, StatusBar, StyleSheet, Platform } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { TouchableView } from './TouchableView';
import { Colors, IconSize } from '../styles';
import { StatusBarBackground } from './StatusBarBackground';
import { Screen } from '../Screen';

const onPress = () => {
    // TODO scroll to top
};

const SettingsIconName = Platform.OS === 'ios' ? 'ios-settings' : 'md-settings';

export interface StateProps {
    screenToShow: Screen;
}

export interface DispatchProps {
    onPressSettings: (currentScreen: Screen) => void;
}

type Props = StateProps & DispatchProps;

export const HeaderTitleComponent = (props: Props) =>
    <View>
        {Platform.OS === 'ios' && <StatusBarBackground/>}
        <TouchableView onPress={onPress} style={styles.headerContainer}>
            <View style={styles.leftPlaceholder}/>
            <Text style={styles.titleText}>Keydrop</Text>
            <TouchableView
                style={styles.settingsIconContainer}
                onPress={() => props.onPressSettings(props.screenToShow)}
            >
                <Ionicon name={SettingsIconName} color={Colors.DARK_GRAY} size={IconSize.MEDIUM_LIST_ICON} />
            </TouchableView>
        </TouchableView>
    </View>;

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: 50,
        alignItems: 'center',
        paddingTop: 10,
        backgroundColor: Colors.WHITE,
    },
    settingsIconContainer: {
        width: 30,
    },
    leftPlaceholder: {
        width: 30,
    },
    titleText: {
        fontSize: 18,
        fontWeight: '500',
    },
});
