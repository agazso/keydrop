import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform } from 'react-native';

import { Colors } from '../styles';
import { Contact } from '../models/Contact';
import { User } from '../models/User';
import { Registration } from './Registration';
import { ContactList } from './ContactList';

export interface StateProps {
    contacts: Contact[];
    alreadyHasKey: boolean;
    user: User;
    contactRandom: string;
}

export interface DispatchProps {
    onCreateUser: (username: string) => void;
    onCreateContact: (data: ContactData) => void;
    onNotifyContacts: () => void;
}

type Props = StateProps & DispatchProps;

const InnerComponent = (props: Props) => props.alreadyHasKey
    ? <ContactList
            contacts={props.contacts}
            user={props.user}
            contactRandom={props.contactRandom}
            onCreateContact={props.onCreateContact}
            onNotifyContacts={props.onNotifyContacts}
      />
    : <Registration onCreateUser={props.onCreateUser}/>
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
