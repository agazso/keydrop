import * as React from 'react';
import { View, Text, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native';

const defaultHitSlop = {
    top: 20,
    left: 20,
    bottom: 20,
    right: 20,
};

export const TouchableView = (props) => (
    <TouchableWithoutFeedback onPress={props.onPress} hitSlop={props.hitSlop ? props.hitSlop : defaultHitSlop}>
        <View {...props} >
            {props.children}
        </View>
    </TouchableWithoutFeedback>
);
