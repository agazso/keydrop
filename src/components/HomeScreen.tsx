import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform } from 'react-native';

import { ContactList } from './ContactList';
import { Colors } from '../styles';

const HomeScreenView = Platform.OS === 'ios' ? SafeAreaView : View;

export const HomeScreen = (props) =>
    <HomeScreenView style={styles.listContainer}>
        <ContactList contacts={props.contacts} />
    </HomeScreenView>;

const styles = StyleSheet.create({
    listContainer: {
        backgroundColor: Colors.WHITE,
        padding: 0,
        margin: 0,
        height: '100%',
    },
});
