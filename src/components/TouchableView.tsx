import * as React from 'react';
import { View, Text, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native';

const defaultHitSlop = {
    top: 15,
    left: 15,
    bottom: 15,
    right: 15,
};

export const TouchableView = (props) => (
    <TouchableWithoutFeedback onPress={props.onPress} hitSlop={props.hitSlop ? props.hitSlop : defaultHitSlop}>
        <View {...props} >
            {props.children}
        </View>
    </TouchableWithoutFeedback>
);
