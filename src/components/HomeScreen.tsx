import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform } from 'react-native';

import { ContactList } from './ContactList';
import { Colors } from '../styles';

export const HomeScreen = (props) =>
    <SafeAreaView style={styles.listContainer}>
        <ContactList contacts={props.contacts} />
    </SafeAreaView>;

const styles = StyleSheet.create({
    listContainer: {
        backgroundColor: Colors.WHITE,
        padding: 0,
        margin: 0,
        height: '100%',
    },
});
