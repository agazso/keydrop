import * as React from 'react';
import { View, Text, StyleSheet, Platform, Clipboard } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { Colors, IconSize, DefaultFont } from '../styles';
import { Contact, isContactOnline } from '../models/Contact';
import { TouchableView } from './TouchableView';
import { SimpleTextInput } from './SimpleTextInput';

interface ContactItemProps {
    isSelected: boolean;
    item: Contact;

    onSelectContact: (contactPublicKey: string | null) => void;
    onSend: (publicKey: string, secret: string) => void;
}

const CopyIconName = Platform.OS === 'ios' ? 'ios-copy-outline' : 'md-copy';

export class ContactItem extends React.PureComponent<ContactItemProps> {
    private textInputValue = '';

    public render() {
        const isOnline = isContactOnline(this.props.item, Date.now());
        const titleColor = isOnline
            ? Colors.DARK_GRAY
            : Colors.LIGHT_GRAY
            ;
        return (
            <TouchableView
                style={styles.listItem}
                onPress={() => {
                    console.log('onPress: ', this.props);
                    this.props.onSelectContact(this.props.isSelected ? null : this.props.item.publicKey);
                }}
            >
                <View style={styles.listItemTitleContainer}>
                    <View style={styles.listItemTitleLeftContainer}>
                        { isOnline && <View style={styles.listItemOnlineIndicator}/> }
                        <Text style={[styles.listItemTitle, {color: titleColor}]}>{this.props.item.name}</Text>
                    </View>
                    <View style={styles.listItemTitleRightContainer}>
                        <TouchableView onPress={this.onSend}>
                            <Text style={styles.listItemSendText}>Send clipboard</Text>
                        </TouchableView>
                    </View>
                </View>
                <Text style={styles.listItemSubTitle}>{JSON.stringify(this.props.item)}</Text>
                <View style={styles.listItemSeparatorContainer}>
                    <View style={styles.horizontalRuler}></View>
                </View>
            </TouchableView>
        );
    }

    private onSend = async () => {
        const data = await Clipboard.getString();
        this.props.onSend(this.props.item.publicKey, data);
        this.props.onSelectContact(null);
    }

    private onChangeText = (text: string) => {
        this.textInputValue = text;
    }
}

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
    listItemTitleContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    listItemTitleLeftContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    listItemTitleRightContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    listItemOnlineIndicator: {
        width: 10,
        height: 10,
        borderRadius: 10 / 2,
        backgroundColor: Colors.IOS_GREEN,
        marginLeft: 14,
    },
    listItemTitle: {
        fontSize: 17,
        color: Colors.DARK_GRAY,
        fontWeight: '400',
        fontFamily: DefaultFont,
        paddingVertical: 10,
        paddingLeft: 10,
    },
    listItemSendText: {
        borderColor: Colors.LIGHT_GRAY,
        borderWidth: 0.5,
        padding: 3,
        marginRight: 10,
    },
    listItemSubTitle: {
        fontSize: 12,
        color: Colors.LIGHT_GRAY,
        fontFamily: DefaultFont,
        paddingVertical: 2,
        paddingLeft: 10,
    },
    listItemActionContainer: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingHorizontal: 10,
        width: '100%',
    },
    listItemActionButton: {
        paddingTop: 8,
        paddingHorizontal: 3,
    },
    listItemTextInput: {
        marginTop: 2,
        marginLeft: 5,
        padding: 3,
        borderWidth: 1,
        borderColor: Colors.LIGHT_GRAY,
        width: '84%',
    },
    listItemSeparatorContainer: {
        backgroundColor: Colors.WHITE,
        paddingHorizontal: 0,
        paddingTop: 10,
        margin: 0,
        marginHorizontal: 0,
        width: '100%',
    },
    horizontalRuler: {
        backgroundColor: Colors.WHITE,
        padding: 0,
        borderBottomColor: Colors.LIGHT_GRAY,
        borderBottomWidth: 1,
    },
});
