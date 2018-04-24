import * as React from 'react';
import {
    TextInput,
    TextStyle,
} from 'react-native';

interface SimpleTextInputProps {
    style: TextStyle;
    placeholder: string;
    autoFocus?: boolean;
    numberOfLines?: number;
    multiline?: boolean;
    defaultValue?: string;
    underlineColorAndroid?: string;

    onSubmitEditing?: (text: string) => void;
    onChangeText?: (text: string) => void;
}

export class SimpleTextInput extends React.Component<SimpleTextInputProps, { text: string }> {
    public state = {
        text: this.props.defaultValue ? this.props.defaultValue : '',
    };

    public render() {
        return (
            <TextInput
                style={this.props.style}
                onChangeText={(text) => {
                    this.setState({text});
                    if (this.props.onChangeText != null) {
                        this.props.onChangeText(text);
                    }
                }}
                onSubmitEditing={(event) => {
                    if (this.props.onSubmitEditing != null) {
                        this.props.onSubmitEditing(this.state.text.trim());
                    }
                    this.setState({ text: '' });
                }}
                value={this.state.text}
                placeholder={this.props.placeholder}
                autoFocus={this.props.autoFocus}
                multiline={this.props.multiline}
                numberOfLines={this.props.numberOfLines}
                underlineColorAndroid={this.props.underlineColorAndroid}
            />
        );
    }
}
