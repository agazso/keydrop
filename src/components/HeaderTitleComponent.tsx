import * as React from 'react';
import { View, Text, StatusBar, StyleSheet, Platform } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { TouchableView } from './TouchableView';
import { Colors, IconSize } from '../styles';

const onPress = () => {
    // TODO scroll to top
};

const SettingsIconName = Platform.OS === 'ios' ? 'ios-settings' : 'md-settings';

export const HeaderTitleComponent = (props) =>
    <TouchableView onPress={onPress} style={styles.headerContainer}>
        <View/>
        <View>
            <Text style={styles.titleText}>Keydrop</Text>
        </View>
        <TouchableView style={styles.settingsIconContainer}>
            <Ionicon name={SettingsIconName} color={Colors.DARK_GRAY} size={IconSize.MEDIUM_LIST_ICON} />
        </TouchableView>
    </TouchableView>;

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    settingsIconContainer: {
        marginRight: 10,
        marginTop: -4,
    },
    titleText: {
        fontWeight: '500',
    },
});
