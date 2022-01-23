import {DefaultText} from './DefaultText';
import {OverlayLoadingIndicator} from './OverlayLoadingIndicator';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {Animated, Easing, Platform, TouchableOpacity, View} from 'react-native';
import {colors} from '../Styles/style';
import {withContext} from './GlobalContextConsumerComponent';
import {CrossComponentValueManager} from './CrossComponentValueManager';
import {Constants} from './Constants';
import {GlobalContext} from '../AppFrame';

let messageRequestValueManager = new CrossComponentValueManager();
let messageRequestSetter = messageRequestValueManager.createValueSetter();
const errorColor = colors.red;
const successColor = colors.green;

export let MessageDisplayingComponent = function (props) {
    const context = useContext(GlobalContext);

    function displayErrorMessage(message) {
        messageRequestSetter({type: Constants.messageTypes.error, message});
    }

    function displaySuccessMessage(message) {
        messageRequestSetter({type: Constants.messageTypes.success, message});
    }

    return (
        <View style={context.style.messageDisplayingComponentContainer}>
            <MessageDisplayer
                messageRequestValueManager={messageRequestValueManager}
            />

            {props.renderer({
                displayErrorMessage: displayErrorMessage,
                displaySuccessMessage: displaySuccessMessage,
            })}

            <OverlayLoadingIndicator/>
        </View>
    );
};

export let MessageDisplayer = function (props) {
    const context = useContext(GlobalContext);
    const [renderContent, setRenderContent] = useState(null);

    props.messageRequestValueManager.reactToValueChangeWith(onMessageRequest);


    function onMessageDisappear() {
        setRenderContent(null);
    }

    function onMessageRequest(messageRequest) {
        if (messageRequest.type === Constants.messageTypes.error) {
            displayErrorMessage(messageRequest.message);
        } else if (messageRequest.type === Constants.messageTypes.success) {
            displaySuccessMessage(messageRequest.message);
        }
    }

    function displayErrorMessage(message) {
        setRenderContent(
            <Message
                messageColor={errorColor}
                message={message}
                onMessageDisappear={onMessageDisappear}
            />,
        );
    }

    function displaySuccessMessage(message) {
        setRenderContent(
            <Message
                messageColor={successColor}
                message={message}
                onMessageDisappear={onMessageDisappear}
            />,
        );
    }

    return renderContent;
};

let Message = function (props) {
    const mounted = useRef(true);
    const context = useContext(GlobalContext);
    let style = context.style;

    const [messageState, setMessageState] = useState({
        displayMessage: false,
        messageOpacity: new Animated.Value(0),
    });

    function mergeToMessageState(stateChange) {
        if (stateChange) {
            setMessageState(
                {
                    ...messageState,
                    ...stateChange,
                },
            );
        }
    }

    // store whether or not this is mounted in a ref.  Animate message on mount.
    useEffect(function () {
        mounted.current = true;
        animateMessage();

        return function () {
            mounted.current = false;
        };
    }, []);


    function animateMessage() {
        if (mounted.current) {
            mergeToMessageState({
                displayMessage: true,
            });

            Animated.timing(
                messageState.messageOpacity,
                {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.linear,
                    delay: 0,
                    useNativeDriver: false,
                },
            ).start();

            messageState.messageOpacity.addListener(() => {
                closeMessage(Constants.messageDisplayDurationMs);
            });
        }
    }

    function closeMessage(messageDisplayDurationMs) {
        if (messageState.messageOpacity._value === 1) {
            Animated.timing(
                messageState.messageOpacity,
                {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.linear,
                    delay: messageDisplayDurationMs,
                    useNativeDriver: false,
                },
            ).start();

            messageState.messageOpacity.addListener(() => {
                if (messageState.messageOpacity._value === 0) {
                    if (mounted.current) {
                        mergeToMessageState({
                            displayMessage: false,
                        });
                    }
                    props.onMessageDisappear();
                }
            });
        }
    }


    let underlayStyle = style.messageModalUnderlay;
    let messageContainerStyle = [
        style.messageContainerStyle,
        {
            minHeight: (messageState.displayMessage ? 40 : 0),
            backgroundColor: props.messageColor,
        },
    ];

    let additionalStyle = {
        opacity: messageState.messageOpacity,
    };

    if (Platform.OS === 'ios') {
        // overlay shouldn't cover status bar
        additionalStyle.top = (-1 * context.statusBarHeightValueManager.value);
    }

    return (
        <Animated.View
            style={[
                style.messageContainerOverlayStyle,
                additionalStyle,
            ]}>
            <TouchableOpacity
                style={underlayStyle}
                activeOpacity={0.7}
                onPress={closeMessage.bind(null, 0)}
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
                            ]}>{props.message}</DefaultText>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
};
