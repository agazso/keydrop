import * as React from 'react';
import { View, Text, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native';

const defaultHitSlop = {
    top: 30,
    left: 30,
    bottom: 30,
    right: 30,
};

export const TouchableView = (props) => (
    <TouchableWithoutFeedback onPress={props.onPress} hitSlop={props.hitSlop ? props.hitSlop : defaultHitSlop}>
        <View {...props} >
            {props.children}
        </View>
    </TouchableWithoutFeedback>
);
