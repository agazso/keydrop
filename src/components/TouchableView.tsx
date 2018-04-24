import * as React from 'react';
import { View, Text, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native';

export const TouchableView = (props) => (
    <TouchableWithoutFeedback onPress={props.onPress}>
        <View {...props} >
            {props.children}
        </View>
    </TouchableWithoutFeedback>
);
