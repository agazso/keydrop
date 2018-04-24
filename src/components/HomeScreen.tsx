import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform } from 'react-native';

import { ContactList } from './ContactList';
import { Colors } from '../styles';
import { Contact } from '../models/Contact';
import { Registration } from './Registration';

export interface StateProps {
    contacts: Contact[];
    alreadyHasKey: boolean;
}

export interface DispatchProps {
    createUser: (username: string) => void;
}

type Props = StateProps & DispatchProps;

const InnerComponent = (props: Props) => props.alreadyHasKey
    ? <ContactList contacts={props.contacts} />
    : <Registration createUser={props.createUser}/>
    ;

export const HomeScreen = (props: Props) =>
    <SafeAreaView style={styles.listContainer}>
        <InnerComponent {...props} />
    </SafeAreaView>;

const styles = StyleSheet.create({
    listContainer: {
        backgroundColor: Colors.WHITE,
        padding: 0,
        margin: 0,
        height: '100%',
    },
});
