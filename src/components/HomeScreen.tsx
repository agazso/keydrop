import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, Modal, BackHandler } from 'react-native';

import { Colors } from '../styles';
import { Contact } from '../models/Contact';
import { User } from '../models/User';
import { Registration } from './Registration';
import { ContactList } from './ContactList';
import { Screen } from '../Screen';
import { Settings } from './Settings';
import { HeaderTitleContainer } from '../containers/HeaderTitleContainer';
import { LoadingScreen } from './LoadingScreen';

export interface StateProps {
    contacts: Contact[];
    screenToShow: Screen;
    user: User;
    contactRandom: string;
}

export interface DispatchProps {
    onCreateUser: (username: string) => void;
    onDeleteUser: () => void;
    onCreateContact: (data: ContactData) => void;
    onNotifyContacts: () => void;
    onSend: (publicKey: string, address: string, secret: string) => void;
    onCloseSettings: () => void;
}

type Props = StateProps & DispatchProps;

interface Children {
    children: JSX.Element[];
}

const WithHeader = (props: Props & Children) => (
    <View>
        <HeaderTitleContainer/>
        {props.children}
    </View>
);

const ContactListWithHeader = (props) => WithHeader({...props, children: (
    <ContactList
        contacts={props.contacts}
        user={props.user}
        contactRandom={props.contactRandom}
        onCreateContact={props.onCreateContact}
        onNotifyContacts={props.onNotifyContacts}
        onSend={props.onSend}
    />
)});

interface SettingsProps {
    visible: boolean;
}

class ContactsWithSettingsModal extends React.Component<Props & SettingsProps> {
    public componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onHardwareBackPressed);
    }

    public render() {
        return (
            <View>
                <Modal
                    animationType='slide'
                    transparent={false}
                    visible={this.props.visible}
                    onRequestClose={this.props.onCloseSettings}
                >
                    <Settings {...this.props} />
                </Modal>
                <ContactListWithHeader {...this.props} />
            </View>
        );
    }

    private onHardwareBackPressed = () => {
        console.log('hardwareBackPress', this.props);
    }
}

const InnerComponent = (props: Props) => {
    switch (props.screenToShow) {
        case 'home': return (
            <ContactsWithSettingsModal {...props} visible={false} />
        );
        case 'registration': return (
            <Registration onCreateUser={props.onCreateUser}/>
        );
        case 'settings': return (
            <ContactsWithSettingsModal {...props} visible={true} />
        );
        case 'loading': return (
            <LoadingScreen />
        );
    }
};

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
