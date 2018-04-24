import * as React from 'react';
import {
    View,
    Text,
    Animated,
    FlatList,
    Dimensions,
    StyleSheet,
    Button,
    TouchableWithoutFeedback,
    Alert,
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Contact } from '../models/Contact';
import { Colors, DefaultFont, IconSize } from '../styles';
import { TouchableView } from './TouchableView';

const AnimatedList = Animated.createAnimatedComponent(FlatList);
const PaddingBottom = 60;

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const ContactItem = (props) =>
    <View style={styles.listItem}>
        <Text style={styles.listItemTitle}>{props.item.name}</Text>
        <View style={[styles.itemSeparatorContainer, {width: Width}]}>
            <View style={styles.horizontalRuler}></View>
        </View>
    </View>;

interface ContactListProps {
    contacts: Contact[];
}

export class ContactList extends React.PureComponent<ContactListProps> {
    public render() {
        return (
            <AnimatedList
                ListFooterComponent={<View style={{paddingBottom: PaddingBottom}} ></View>}
                ListHeaderComponent={ListHeader}
                renderItem={
                    (item) => (
                        <ContactItem
                            item={item.item}
                        />
                    )
                }
                keyExtractor={this.keyExtractor}
                keyboardDismissMode='interactive'
                maxToRenderPerBatch={15}
                data={this.props.contacts}
            />
        );
    }

    private keyExtractor = (contact: Contact, index: number) => {
        return '' + contact._id;
    }
}

const addContact = () => {
    Alert.alert('addContact');
};

const ListHeader = (props) => (
    <View style={styles.listHeader}>
        <View style={styles.listHeaderButtonContainer}>
            <TouchableView style={styles.listHeaderLeftButton} onPress={addContact}>
                <Ionicon name='ios-contacts' size={128} color={Colors.DEFAULT_ACTION_COLOR} />
                <Button title='Add contact' onPress={addContact} />
            </TouchableView>
            <View style={styles.listHeaderRightButton}>
                <MaterialCommunityIcon name='qrcode' size={128} color={Colors.DEFAULT_ACTION_COLOR} />
                <Button title='Scan code' onPress={addContact} />
            </View>
        </View>
        <View style={styles.listHeaderBottom}>
            <View style={styles.horizontalRuler}></View>
        </View>
    </View>
);

const styles = StyleSheet.create({
    listItem: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: Colors.WHITE,
        paddingLeft: 0,
        paddingTop: 10,
        paddingBottom: 0,
        marginHorizontal: 0,
    },
    listItemTitle: {
        fontSize: 17,
        color: Colors.DARK_GRAY,
        fontWeight: '400',
        fontFamily: DefaultFont,
        paddingVertical: 10,
        paddingLeft: 10,
    },
    listHeader: {
        height: 200,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    listHeaderButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    listHeaderLeftButton: {
        flexDirection: 'column',
    },
    listHeaderRightButton: {
    },
    listHeaderBottom: {
    },
    itemSeparatorContainer: {
        backgroundColor: Colors.WHITE,
        paddingHorizontal: 0,
        paddingTop: 10,
        margin: 0,
        marginHorizontal: 0,
    },
    horizontalRuler: {
        backgroundColor: Colors.WHITE,
        padding: 0,
        borderBottomColor: Colors.LIGHT_GRAY,
        borderBottomWidth: 1,
    },
});
