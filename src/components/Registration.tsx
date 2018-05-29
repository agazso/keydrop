import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { Colors, DefaultFont } from '../styles';
import { SimpleTextInput } from './SimpleTextInput';

export interface StateProps {
}

export interface DispatchProps {
    onCreateUser: (username: string) => void;
}

type Props = StateProps & DispatchProps;

const Separator = (props) => Platform.OS === 'ios'
    ? <View style={styles.separator} />
    : <View/>
    ;

const PlaceholderText = 'What\'s your name?';
const CopyText = 'Keydrop is an app for sharing secrets.';
const HelloText = 'Hello!';

export const Registration = (props: Props) => (
    <KeyboardAvoidingView
        style={styles.registrationContainer}
    >
        <Text style={styles.textHello}>{HelloText}</Text>
        <Text style={styles.textCopy}>{CopyText}</Text>
        <View style={styles.contactIconContainer}>
            <Ionicon name='ios-contact' size={128} color={Colors.IOS_GRAY} />
        </View>
        <SimpleTextInput
            style={styles.textInputName}
            autoFocus={true}
            underlineColorAndroid={Colors.IOS_GRAY}
            placeholder={PlaceholderText}
            onSubmitEditing={(text) => props.onCreateUser(text)}
        />
        <Separator/>
    </KeyboardAvoidingView>
);

const styles = StyleSheet.create({
    registrationContainer: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: Colors.WHITE,
        padding: 0,
        margin: 0,
        height: '100%',
    },
    textHello: {
        fontFamily: DefaultFont,
        fontSize: 32,
        textAlign: 'center',
        paddingTop: 20,
    },
    textCopy: {
        fontFamily: DefaultFont,
        fontSize: 18,
        textAlign: 'center',
        paddingTop: 10,
    },
    contactIconContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 20,
    },
    textName: {
        fontFamily: DefaultFont,
        fontSize: 16,
        textAlign: 'center',
        paddingTop: 20,
    },
    textInputName: {
        height: 60,
        fontSize: 32,
        color: Colors.DARK_GRAY,
        paddingHorizontal: 50,
        textAlign: 'center',
    },
    separator: {
        marginHorizontal: 50,
        borderBottomColor: Colors.LIGHT_GRAY,
        borderBottomWidth: 1,
    },

});
