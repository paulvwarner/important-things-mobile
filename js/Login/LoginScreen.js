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
    Image,
} from 'react-native';
import {styleFunctions} from '../Styles/style';
import {withContext} from '../Common/GlobalContextConsumerComponent';
import {Constants} from '../Common/Constants';
import {Storage} from '../Common/Storage';

export let LoginScreen = withContext(class extends React.Component {
    constructor(props) {
        super(props);
        let self = this;

        this.loadingStatusSetter = props.context.loadingStatusValueManager.createValueSetter();

        self.loadingStatusSetter(true);

        window.setTimeout(function () {
            self.checkIfLoggedIn()
                .then(function (loginData) {
                    if (loginData) {
                        self.loadingStatusSetter(true);
                        self.handleLoginSuccess(loginData);
                    } else {
                        self.showPageContent();
                    }
                })
                .catch(function (error) {
                    console.log('ERROR during login check: ', error);
                    self.showPageContent();
                });
        }, 0);

        this.state = {
            username: this.props.context.globalSettings.fillUsername,
            password: this.props.context.globalSettings.fillPassword,
            viewOpacity: new Animated.Value(0.0),
            statusBarHeight: styleFunctions.getMinimumStatusBarHeight(),
        };
    }

    componentDidMount = () => {
        this.mounted = true;
    };

    componentWillUnmount = () => {
        this.mounted = false;
    };

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        var self = this;
        var params = this.props.navigation.state.params;
        if (params.lastLogoutTime !== prevProps.navigation.state.params.lastLogoutTime) {
            this.startedLogin = false;
            this.showPageContent();
        }
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
                    useNativeDriver: true,
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

    checkIfLoggedIn = () => {
        return new Promise(function (resolve, reject) {
            Storage.get(Constants.storage.loginData)
                .then(function (loginData) {
                    if (loginData) {
                        resolve(loginData);
                    } else {
                        resolve(false);
                    }
                })
                .catch(function (error) {
                    console.log('Error fetching loginData: ', error);
                    resolve(false);
                });
        });
    };

    login = () => {
        var self = this;
        var apiUtility = this.props.context.apiUtility;
        apiUtility.setNavigationUtility(this.props.context.navigationUtility);
        Keyboard.dismiss();

        if (this.state.username && ('' + this.state.username).trim().length > 0 &&
            this.state.password && ('' + this.state.password).trim().length > 0) {

            this.loadingStatusSetter(true);
            try {
                apiUtility.login(this.state.username, this.state.password)
                    .then(function (loginData) {
                        if (loginData.user.authentication_token) {
                            self.handleLoginSuccess(loginData);
                        } else {
                            if (loginData.message) {
                                throw new Error(loginData.message);
                            } else {
                                throw new Error(Constants.errorMessages.incorrectCredentialsLogin);
                            }
                        }
                    })
                    .catch(function (error) {
                        console.log('An error occurred during login.', error.message, error);

                        if (error && error.message && (
                            error.message === Constants.errorMessages.incorrectCredentialsLogin ||
                            error.message === Constants.errorMessages.userDeactivatedLogin ||
                            error.message === Constants.errorMessages.userCannotUseApp
                        )) {
                            self.handleLoginError(error.message);
                        } else {
                            self.handleLoginError('An error occurred during login.');
                        }
                    });
            } catch (error) {
                this.handleLoginError(error);
            }
        } else {
            self.props.context.messageDisplayerUtility.displayErrorMessage('Please enter both a username and a password.');
        }
    };

    handleLoginSuccess = (loginData) => {
        var self = this;
        var apiUtility = this.props.context.apiUtility;

        apiUtility.setToken(loginData.user.authentication_token);
        apiUtility.setLoginData(loginData);

        // fade out, then go to next screen
        Animated.timing(
            this.state.viewOpacity,
            {
                toValue: 0.0,
                duration: 500,
                easing: Easing.linear,
                delay: 0,
                useNativeDriver: true
            },
        ).start();

        self.state.viewOpacity.addListener(() => {
            if (self.state.viewOpacity._value === 0 && !self.startedLogin) {
                self.startedLogin = true;

                self.props.context.navigationUtility.navigateTo(
                    Constants.routes.home.name,
                    {afterLogin: true},
                );

                self.state.viewOpacity.removeAllListeners();
            }
        });
    };

    handleLoginError = (error) => {
        var self = this;
        window.setTimeout(function () {
            self.loadingStatusSetter(false);
            self.props.context.messageDisplayerUtility.displayErrorMessage(error);
        }, 0);
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
                                                        <Image
                                                            style={style.loginScreenLogo}
                                                            source={require('../../images/logo.png')}
                                                        />
                                                        <DefaultText
                                                            style={style.loginScreenLabel}
                                                        >IMPORTANT THINGS</DefaultText>
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


