import * as React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export const LoadingScreen = (props) => (
    <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#000000' />
    </View>
);

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
    },
});
