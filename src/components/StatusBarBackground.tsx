import * as React from 'react';
import {
    View,
    StyleProp,
    StyleSheet,
    ViewStyle,
    Platform,
} from 'react-native';

export const StatusBarBackground = (props: { style?: StyleProp<ViewStyle> }) =>
    <View style={[styles.statusBarBackground, props.style || {}]}>
    </View>;

const styles = StyleSheet.create({
    statusBarBackground: {
        height: (Platform.OS === 'ios') ? 20 : 0,
    },
});
