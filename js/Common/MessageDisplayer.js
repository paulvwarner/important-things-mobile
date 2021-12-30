import {DefaultText} from './DefaultText';
import {OverlayLoadingIndicator} from './OverlayLoadingIndicator';
import React from 'react';
import {Animated, Easing, Platform, TouchableOpacity, View} from 'react-native';
import {colors} from '../Styles/style';
import {withContext} from './GlobalContextConsumerComponent';
import {CrossComponentValueManager} from './CrossComponentValueManager';
import {Constants} from './Constants';

export let MessageDisplayingComponent = withContext(class extends React.Component {
    constructor(props) {
        super(props);
        this.messageRequestValueManager = new CrossComponentValueManager();
        this.messageRequestSetter = this.messageRequestValueManager.createValueSetter();

        this.messageDisplayer = {
            displayErrorMessage: this.displayErrorMessage,
            displaySuccessMessage: this.displaySuccessMessage,
        }
    };

    render = () => {
        return (
            <View style={[this.props.context.style.messageDisplayingComponentContainer]}>
                <MessageDisplayer
                    messageRequestValueManager={this.messageRequestValueManager}
                    statusBarHeightValueManager={this.props.context.statusBarHeightValueManager}
                    ref="messageDisplayer"
                />

                {this.props.renderer(this.messageDisplayer)}

                <OverlayLoadingIndicator/>
            </View>
        );
    };

    displayErrorMessage = (message) => {
        this.messageRequestSetter({type: Constants.messageTypes.error, message})
    };

    displaySuccessMessage = (message) => {
        this.messageRequestSetter({type: Constants.messageTypes.success, message})
    };
});

export let MessageDisplayer = withContext(class extends React.Component {
    constructor(props) {
        super(props);

        this.props.messageRequestValueManager.reactToValueChangeWith(this.onMessageRequest);

        this.errorColor = colors.red;
        this.successColor = colors.green;
        this.state = {renderContent: null};
    };

    onMessageDisappear = () => {
        this.setState({
            renderContent: null
        });
    };

    onMessageRequest = (messageRequest) => {
        if (messageRequest.type === Constants.messageTypes.error) {
            this.displayErrorMessage(messageRequest.message);
        } else if (messageRequest.type === Constants.messageTypes.success) {
            this.displaySuccessMessage(messageRequest.message);
        }
    };

    displayErrorMessage = (message) => {
        this.setState({
            renderContent: (
                <Message
                    messageColor={this.errorColor}
                    message={message}
                    onMessageDisappear={this.onMessageDisappear}
                    statusBarHeightValueManager={this.props.context.statusBarHeightValueManager}
                />
            )
        });
    };

    displaySuccessMessage = (message) => {
        this.setState({
            renderContent: (
                <Message
                    messageColor={this.successColor}
                    message={message}
                    onMessageDisappear={this.onMessageDisappear}
                    statusBarHeightValueManager={this.props.context.statusBarHeightValueManager}
                />
            )
        });
    };

    render = () => {
        return (
            this.state.renderContent
        );
    }
});

let Message = withContext(class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayMessage: false,
            messageOpacity: new Animated.Value(0),
            closingMessage: false,
            message: this.props.message
        };
    };

    componentDidMount = () => {
        this.mounted = true;
        this.animateMessage();
    };

    componentWillUnmount = () => {
        this.mounted = false;
    };

    animateMessage = () => {
        if (this.mounted) {
            this.setState({
                displayMessage: true,
            });

            Animated.timing(
                this.state.messageOpacity,
                {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.linear,
                    delay: 0,
                    useNativeDriver: false
                }
            ).start();

            this.state.messageOpacity.addListener(() => {
                this.closeMessage(3000);
            });
        }
    };

    closeMessage = (delayMs) => {
        if (this.state.messageOpacity._value === 1) {
            Animated.timing(
                this.state.messageOpacity,
                {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.linear,
                    delay: delayMs,
                    useNativeDriver: false
                }
            ).start();

            this.state.messageOpacity.addListener(() => {
                if (this.state.messageOpacity._value === 0) {
                    if (this.mounted) {
                        this.setState({
                            displayMessage: false
                        });
                    }
                    this.props.onMessageDisappear();
                }
            });
        }
    };

    render = () => {
        let style = this.props.context.style;

        let underlayStyle = style.messageModalUnderlay;
        let messageContainerStyle = [
            style.messageContainerStyle,
            {
                minHeight: (this.state.displayMessage ? 40 : 0),
                backgroundColor: this.props.messageColor
            }
        ];

        let additionalStyle = {
            opacity: this.state.messageOpacity,
        }

        if (Platform.OS === 'ios') {
            // overlay shouldn't cover status bar
            additionalStyle.top = (-1 * this.props.context.statusBarHeightValueManager.value);
        }

        return (
            <Animated.View
                style={[
                    style.messageContainerOverlayStyle,
                    additionalStyle
                ]}>
                <TouchableOpacity
                    style={underlayStyle}
                    activeOpacity={0.7}
                    onPress={this.closeMessage.bind(this, 0)}
                />

                <View
                    pointerEvents="none"
                    style={messageContainerStyle}
                >
                    <View style={style.messageColumnStyle}>
                        <View style={style.messageRowStyle}>
                            <DefaultText
                                style={[
                                    style.messageTextStyle,
                                ]}>{this.props.message}</DefaultText>
                        </View>
                    </View>
                </View>
            </Animated.View>
        );
    };
});
