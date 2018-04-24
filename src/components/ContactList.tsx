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
import QRCode from 'react-native-qrcode-svg';
import { generateSecureRandom } from 'react-native-securerandom';

import { Contact } from '../models/Contact';
import { Colors, DefaultFont, IconSize } from '../styles';
import { TouchableView } from './TouchableView';
import { PrivateIdentity } from '../models/Identity';
import { User } from '../models/User';

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
    user: User;
}

export class ContactList extends React.PureComponent<ContactListProps> {
    public render() {
        return (
            <AnimatedList
                ListFooterComponent={<View style={{paddingBottom: PaddingBottom}} ></View>}
                ListHeaderComponent={<ListHeader user={this.props.user}/>}
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

interface ListHeaderProps {
    user: User;
}

interface ListHeaderState {
    headerState: 'default' | 'add-contact' | 'scan-code';
    QRCodeValue: string;
}

class ListHeader extends React.PureComponent<ListHeaderProps, ListHeaderState> {
    public state: ListHeaderState = {
        headerState: 'default',
        QRCodeValue: '',
    };

    public render() {
        switch (this.state.headerState) {
            case 'default': return <this.DefaultListHeader/>;
            case 'add-contact': return <this.AddContactListHeader/>;
            case 'scan-code': return <this.ScanCodeListHeader/>;
        }
    }

    private DefaultListHeader = (props) => (
        <View style={styles.listHeader}>
            <View style={styles.listHeaderButtonContainer}>
                <TouchableView style={styles.listHeaderLeftButton} onPress={this.onAddContact}>
                    <Ionicon name='ios-contacts' size={128} color={Colors.DARK_GRAY} />
                    <Button title='Add contact' onPress={this.onAddContact} color={Colors.DARK_GRAY}/>
                </TouchableView>
                <TouchableView style={styles.listHeaderRightButton} onPress={this.onScanCode}>
                    <MaterialCommunityIcon name='qrcode' size={128} color={Colors.DARK_GRAY} />
                    <Button title='Scan code' onPress={this.onScanCode} color={Colors.DARK_GRAY}/>
                </TouchableView>
            </View>
            <View style={styles.listHeaderBottom}>
                <View style={styles.horizontalRuler}></View>
            </View>
        </View>
    )

    private generateQRCodeValue = async () => {
        const randomBytes = await generateSecureRandom(32);

        return JSON.stringify({
            publicKey: this.props.user.identity.publicKey,
            timestamp: Date.now(),
            random: randomBytes,
        });
    }

    private AddContactListHeader = (props) => (
        <View style={styles.listHeader}>
            <View style={styles.listHeaderButtonContainer}>
                <View style={styles.listHeaderLeftButton}>
                </View>

                <View style={styles.qrCodeContainer}>
                    <QRCode value={this.state.QRCodeValue} size={200} />
                </View>

                <View style={styles.listHeaderRightButton}>
                    <TouchableView onPress={this.onClose}>
                        <Ionicon name='ios-close' size={40} />
                    </TouchableView>

                    <TouchableView>
                        <Ionicon name='ios-share-outline' size={32} />
                    </TouchableView>
                </View>
            </View>
            <View style={styles.listHeaderBottom}>
                <View style={styles.horizontalRuler}></View>
            </View>
        </View>
    )

    private ScanCodeListHeader = (props) => (
        <View style={styles.listHeader}>
            <View style={styles.listHeaderButtonContainer}>
                <View style={styles.listHeaderLeftButton}>
                </View>

                <View style={styles.qrCodeContainer}>

                </View>

                <View style={styles.listHeaderRightButton}>
                    <TouchableView onPress={this.onClose}>
                        <Ionicon name='ios-close' size={40} />
                    </TouchableView>

                    <TouchableView>
                        <Ionicon name='ios-share-outline' size={32} />
                    </TouchableView>
                </View>
            </View>
            <View style={styles.listHeaderBottom}>
                <View style={styles.horizontalRuler}></View>
            </View>

        </View>
    )

    private onAddContact = async () => {
        const QRCodeValue = await this.generateQRCodeValue();
        this.setState({
            headerState: 'add-contact',
            QRCodeValue: QRCodeValue,
        });
    }

    private onScanCode = () => {
        this.setState({
            headerState: 'scan-code',
        });
    }

    private onClose = () => {
        this.setState({
            headerState: 'default',
        });
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
        flexDirection: 'column',
        justifyContent: 'space-between',
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
    qrCodeContainer: {
    },
});
