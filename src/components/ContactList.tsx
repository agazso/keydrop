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
    Easing,
    Platform,
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import QRCode from 'react-native-qrcode-svg';
import QRCodeScanner from 'react-native-qrcode-scanner';

import { Contact } from '../models/Contact';
import { Colors, DefaultFont, IconSize } from '../styles';
import { TouchableView } from './TouchableView';
import { PrivateIdentity } from '../models/Identity';
import { User } from '../models/User';
import { generateRandomString } from '../random';
import { testUserBob } from '../reducers/index';

const AnimatedList = Animated.createAnimatedComponent(FlatList);
const PaddingBottom = 60;

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
const QRCodeWidth = 200;
const QRCodeHeight = 200;

const ContactItem = (props) =>
    <View style={styles.listItem}>
        <Text style={styles.listItemTitle}>{props.item.name}</Text>
        <Text style={styles.listItemSubTitle}>{JSON.stringify(props.item)}</Text>
        <View style={[styles.itemSeparatorContainer, {width: Width}]}>
            <View style={styles.horizontalRuler}></View>
        </View>
    </View>;

interface ContactListStateProps {
    contacts: Contact[];
    user: User;
    contactRandom: string;
}

interface ContactListDispatchProps {
    onCreateContact: (data: ContactData) => void;
    onNotifyContacts: () => void;
}

type ContactListProps = ContactListStateProps & ContactListDispatchProps;

export class ContactList extends React.PureComponent<ContactListProps> {
    public componentDidMount() {
        this.props.onNotifyContacts();
    }

    public render() {
        if (this.props.contacts.length === 0) {
            return (
                <EmptyListPlaceholder
                    ListHeaderComponent={<this.ListHeader/>}
                />
            );
        } else {
            return <this.List/>;
        }
    }

    private ListHeader = (props) => (
        <ListHeader
            user={this.props.user}
            onCreateContact={this.props.onCreateContact}
            contactRandom={this.props.contactRandom}
        />
    )

    private List = (props) => (
        <AnimatedList
            ListFooterComponent={<View style={{paddingBottom: PaddingBottom}} ></View>}
            ListHeaderComponent={<this.ListHeader/>}
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
    )

    private keyExtractor = (contact: Contact, index: number) => {
        return contact.publicKey;
    }
}

interface EmptyListPlaceholderProps {
    ListHeaderComponent: JSX.Element;
}

class EmptyListPlaceholder extends React.PureComponent<EmptyListPlaceholderProps> {
    // Disabled animation, because it causes the backboardd process
    // to use more than 100% CPU, to be investigated
    private isAnimated = false;
    private animatedValue = new Animated.Value(1);

    public componentDidMount() {
        if (this.isAnimated) {
            this.animate();
        }
    }

    public render() {
        const opacity = this.isAnimated
            ? this.animatedValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 1, 0],
              })
            : 1
            ;

        return (
            <View style={styles.placeholderContainer}>
                {this.props.ListHeaderComponent}
                { Platform.OS === 'ios' &&
                    <View style={styles.wavePlaceholderContainer}>
                        <Animated.View style={[styles.placeholderWawe1, {opacity}]} />
                        <Animated.View style={[styles.placeholderWawe2, {opacity}]} />
                        <Animated.View style={[styles.placeholderWawe3, {opacity}]} />
                        <Animated.View style={[styles.placeholderWawe4, {opacity}]} />
                        <Animated.View style={[styles.placeholderWawe5, {opacity}]} />
                    </View>
                }
            </View>
        );
    }

    private animate() {
        this.animatedValue.setValue(0);
        Animated.timing(
            this.animatedValue, {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear,
            },
        ).start(() => this.animate());
    }
}

interface ListHeaderProps {
    user: User;
    contactRandom: string;
    onCreateContact: (data: ContactData) => void;
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

    private generateQRCodeValue = () => {
        const data: ContactData = {
            publicKey: this.props.user.identity.publicKey,
            timestamp: Date.now(),
            random: this.props.contactRandom,
        };
        return JSON.stringify(data);
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
                    <QRCodeScanner
                        onRead={this.onScanSuccess}
                        containerStyle={{
                            width: QRCodeWidth,
                            height: QRCodeHeight,
                        }}
                        cameraStyle={{
                            width: QRCodeWidth,
                            height: QRCodeHeight,
                        }}
                        fadeIn={false}
                    />
                </View>

                <View style={styles.listHeaderRightButton}>
                    <TouchableView onPress={this.onClose}>
                        <Ionicon name='ios-close' size={40} />
                    </TouchableView>

                    <TouchableView>
                        <Ionicon name='ios-attach-outline' size={32} />
                    </TouchableView>
                </View>
            </View>
            <View style={styles.listHeaderBottom}>
                <View style={styles.horizontalRuler}></View>
            </View>

        </View>
    )

    private onAddContact = () => {
        const QRCodeValue = this.generateQRCodeValue();
        this.setState({
            headerState: 'add-contact',
            QRCodeValue: QRCodeValue,
        });
    }

    private onScanCode = async () => {
        this.setState({
            headerState: 'scan-code',
        });
    }

    private onClose = () => {
        this.setState({
            headerState: 'default',
        });
    }

    private onScanSuccess = (event) => {
        try {
            const data: ContactData = JSON.parse(event.data);
            this.props.onCreateContact(data);
        } catch (e) {
            console.log(e);
        }

        this.onClose();
    }
}

const Wave1Size = 200;
const Wave2Size = 320;
const Wave3Size = 440;
const Wave4Size = 560;
const Wave5Size = 680;
const WaveColor = Colors.LIGHT_GRAY;
const WaveWidth = 0.8;

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
    listItemSubTitle: {
        fontSize: 12,
        color: Colors.LIGHT_GRAY,
        fontFamily: DefaultFont,
        paddingVertical: 2,
        paddingLeft: 10,
    },
    listHeader: {
        height: 200,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: Colors.WHITE,
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
        width: QRCodeWidth,
        height: QRCodeHeight,
    },
    placeholderContainer: {
        backgroundColor: Colors.WHITE,
        padding: 0,
        margin: 0,
        height: '100%',
    },
    wavePlaceholderContainer: {
        height: '100%',
        overflow: 'hidden',
    },
    placeholderWawe1: {
        width: Wave1Size,
        height: Wave1Size,
        borderColor: WaveColor,
        borderRadius: Wave1Size,
        borderWidth: WaveWidth,
        position: 'absolute',
        bottom: 0,
        left: Width / 2 - Wave1Size / 2,
    },
    placeholderWawe2: {
        width: Wave2Size,
        height: Wave2Size,
        borderColor: WaveColor,
        borderRadius: Wave2Size,
        borderWidth: WaveWidth,
        position: 'absolute',
        bottom: 0,
        left: Width / 2 - Wave2Size / 2,
    },
    placeholderWawe3: {
        width: Wave3Size,
        height: Wave3Size,
        borderColor: WaveColor,
        borderRadius: Wave3Size,
        borderWidth: WaveWidth,
        position: 'absolute',
        bottom: 0,
        left: Width / 2 - Wave3Size / 2,
    },
    placeholderWawe4: {
        width: Wave4Size,
        height: Wave4Size,
        borderColor: WaveColor,
        borderRadius: Wave4Size,
        borderWidth: WaveWidth,
        position: 'absolute',
        bottom: 0,
        left: Width / 2 - Wave4Size / 2,
    },
    placeholderWawe5: {
        width: Wave5Size,
        height: Wave5Size,
        borderColor: WaveColor,
        borderRadius: Wave5Size,
        borderWidth: WaveWidth,
        position: 'absolute',
        bottom: 0,
        left: Width / 2 - Wave5Size / 2,
    },
});
