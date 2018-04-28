import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
                    { isOnline && <View style={styles.listItemOnlineIndicator}/> }
                    <Text style={[styles.listItemTitle, {color: titleColor}]}>{this.props.item.name}</Text>
                </View>
                <Text style={styles.listItemSubTitle}>{JSON.stringify(this.props.item)}</Text>
                { this.props.isSelected &&
                    <View style={styles.listItemActionContainer}>
                        <TouchableView style={styles.listItemActionButton}>
                            <Ionicon name='ios-attach' size={IconSize.LARGE_LIST_ICON} />
                        </TouchableView>
                        <SimpleTextInput
                            placeholder='Enter your secret here'
                            style={styles.listItemTextInput}
                            autoFocus={true}
                            multiline={true}
                            numberOfLines={2}
                            onChangeText={this.onChangeText}
                        />
                        <TouchableView
                            style={styles.listItemActionButton}
                            onPress={this.onSend}
                        >
                            <Ionicon name='ios-send' size={IconSize.LARGE_LIST_ICON} color={Colors.DEFAULT_ACTION_COLOR} />
                        </TouchableView>
                    </View>
                }
                <View style={styles.listItemSeparatorContainer}>
                    <View style={styles.horizontalRuler}></View>
                </View>
            </TouchableView>
        );
    }

    private onSend = () => {
        this.props.onSend(this.props.item.publicKey, this.textInputValue);
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
        justifyContent: 'flex-start',
        width: '100%',
    },
    listItemOnlineIndicator: {
        width: 10,
        height: 10,
        borderRadius: 10 / 2,
        backgroundColor: Colors.IOS_GREEN,
        marginTop: 15,
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
