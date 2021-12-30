import React from 'react';
import {DefaultText} from '../Common/DefaultText';
import {
    Animated,
    Dimensions,
    Easing,
    Keyboard,
    KeyboardAvoidingView,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import {styleFunctions} from '../Styles/style';
import {withContext} from '../Common/GlobalContextConsumerComponent';

export let LoginScreen = withContext(class extends React.Component {
    constructor(props) {
        super(props);
        let self = this;

        this.loadingStatusSetter = props.context.loadingStatusValueManager.createValueSetter();

        self.loadingStatusSetter(true);

        this.state = {
            username: this.props.context.globalSettings.fillUsername,
            password: this.props.context.globalSettings.fillPassword,
            viewOpacity: new Animated.Value(0.0),
            statusBarHeight: styleFunctions.getMinimumStatusBarHeight(),
        };
    }

    componentDidMount = () => {
        this.mounted = true;
        this.showPageContent();
    };

    componentWillUnmount = () => {
        this.mounted = false;
    };

    showPageContent = () => {
        let self = this;

        self.setState({
            showPageContent: true,
        });

        window.setTimeout(function () {
            self.loadingStatusSetter(false);

            // fade in
            Animated.timing(
                self.state.viewOpacity,
                {
                    toValue: 1.0,
                    duration: 1000,
                    easing: Easing.linear,
                    delay: 0,
                },
            ).start();
        }, 0);
    };

    onTouchOutsideInput = () => {
        Keyboard.dismiss();
    };

    handleUsernameSubmit = () => {
        try {
            this.passwordField.focus();
        } catch (e) {
            console && console.log('Couldn\'t focus password field: ', e.message);
        }
    };

    handleValueChange = (field, text) => {
        let nextState = {};
        nextState[field] = text;
        if (this.mounted) {
            this.setState(nextState);
        }
    };

    login = () => {
        // pvw todo
        this.props.context.messageDisplayerUtility.displaySuccessMessage("Test message displayer");
    };

    render = () => {
        let self = this;
        let style = this.props.context.style;

        let underlineColorAndroid = 'transparent';

        return (
            <View style={style.screenFrame}>
                <TouchableWithoutFeedback
                    style={[style.fullWindow]}
                    onPress={this.onTouchOutsideInput}
                >
                    <View style={[style.columnView, style.loginScreenContainer]}>
                        {(() => {
                            if (this.state.showPageContent) {
                                return (
                                    <Animated.View style={[
                                        style.frameViewStyle,
                                        {opacity: this.state.viewOpacity},
                                    ]}>
                                        <TouchableWithoutFeedback
                                            style={[style.fullWindow, style.loginWindow]}
                                            onPress={this.onTouchOutsideInput}>
                                            <View style={style.loginPageStyle}>
                                                <KeyboardAvoidingView
                                                    behavior={'position'}
                                                    keyboardVerticalOffset={-1 * Dimensions.get('window').height / 3.5}
                                                    style={style.loginPageMovingContent}
                                                >
                                                    <View style={style.loginScreenContent}>

                                                        <View style={style.loginPageFormContent}>
                                                            <TextInput
                                                                allowFontScaling={false}
                                                                autoCorrect={false}
                                                                underlineColorAndroid={underlineColorAndroid}
                                                                autoCapitalize={'none'}
                                                                style={[
                                                                    style.defaultTextInput,
                                                                    style.loginPageTextInput,
                                                                    style.loginPageUsername,
                                                                ]}
                                                                value={self.state.username}
                                                                onChangeText={self.handleValueChange.bind(self, 'username')}
                                                                placeholder="Username"
                                                                returnKeyType="next"
                                                                onSubmitEditing={(event) => {
                                                                    self.handleUsernameSubmit();
                                                                }}
                                                            />
                                                            <TextInput
                                                                allowFontScaling={false}
                                                                autoCorrect={false}
                                                                autoCapitalize="none"
                                                                autoComplete="off"
                                                                underlineColorAndroid={underlineColorAndroid}
                                                                ref={(element) => {
                                                                    this.passwordField = element;
                                                                }}
                                                                secureTextEntry={true}
                                                                style={[
                                                                    style.defaultTextInput,
                                                                    style.loginPageTextInput,
                                                                    style.loginPagePassword,
                                                                ]}
                                                                value={self.state.password}
                                                                onChangeText={self.handleValueChange.bind(self, 'password')}
                                                                placeholder="Password"
                                                                returnKeyType="go"
                                                                onSubmitEditing={(event) => {
                                                                    self.login();
                                                                }}
                                                            />

                                                            <TouchableOpacity
                                                                onPress={self.login}
                                                                style={[
                                                                    style.pillButtonContainer,
                                                                    style.loginButtonContainer,
                                                                ]}
                                                            >
                                                                <View
                                                                    style={[
                                                                        style.pillButton,
                                                                        style.loginButton,
                                                                    ]}>
                                                                    <DefaultText
                                                                        style={[
                                                                            style.pillButtonText,
                                                                            style.loginButtonText,
                                                                        ]}
                                                                    >LOGIN</DefaultText>
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </KeyboardAvoidingView>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </Animated.View>
                                );
                            }
                        })()}
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    };
});


