import React, {useContext, useEffect, useRef, useState} from 'react';
import {DefaultText} from '../Common/DefaultText';
import {
    Animated,
    Dimensions,
    Easing,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import {styleFunctions} from '../Styles/style';
import {Constants} from '../Common/Constants';
import {Storage} from '../Common/Storage';
import {GlobalContext} from '../AppFrame';

export let LoginScreen = function (props) {
    const mounted = useRef(true);
    const startedLogin = useRef(false);
    const passwordField = useRef(null);
    const context = useContext(GlobalContext);
    let style = context.style;
    let loadingStatusSetter = context.loadingStatusValueManager.createValueSetter();

    let [formState, setFormState] = useState({
        username: context.globalSettings.fillUsername,
        password: context.globalSettings.fillPassword,
        viewOpacity: new Animated.Value(0.0),
        statusBarHeight: styleFunctions.getMinimumStatusBarHeight(),
        lastLogoutTime: (new Date()).getTime(),
        showPageContent: false,
    });

    function mergeToFormState(stateChange) {
        if (stateChange) {
            setFormState(
                {
                    ...formState,
                    ...stateChange,
                },
            );
        }
    }

    useEffect(function () {
        mounted.current = true;
        loadingStatusSetter(true);

        window.setTimeout(function () {
            checkIfLoggedIn()
                .then(function (loginData) {
                    if (loginData) {
                        loadingStatusSetter(true);
                        handleLoginSuccess(loginData);
                    } else {
                        showPageContent();
                    }
                })
                .catch(function (error) {
                    console.log('ERROR during login check: ', error);
                    showPageContent();
                });
        }, 0);

        return function () {
            mounted.current = false;
        };
    }, []);

    useEffect(function () {
        let lastLogoutTime = props.navigation.state.params.lastLogoutTime;
        if (lastLogoutTime && lastLogoutTime !== formState.lastLogoutTime) {
            mergeToFormState({lastLogoutTime: lastLogoutTime});
            startedLogin.current = false;
            showPageContent();
        }
    }, [props.navigation.state.params.lastLogoutTime]);

    function showPageContent() {
        mergeToFormState({
            showPageContent: true,
        });

        window.setTimeout(function () {
            loadingStatusSetter(false);

            // fade in
            Animated.timing(
                formState.viewOpacity,
                {
                    toValue: 1.0,
                    duration: 1000,
                    easing: Easing.linear,
                    delay: 0,
                    useNativeDriver: true,
                },
            ).start();
        }, 0);
    }

    function onTouchOutsideInput() {
        Keyboard.dismiss();
    }

    function handleUsernameSubmit() {
        try {
            passwordField.current.focus();
        } catch (e) {
            console && console.log('Couldn\'t focus password field: ', e.message);
        }
    }

    function handleValueChange(field, text) {
        let stateChange = {};
        stateChange[field] = text;
        if (mounted.current) {
            mergeToFormState(stateChange);
        }
    }

    function checkIfLoggedIn() {
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
    }

    function login() {
        var apiUtility = context.apiUtility;
        apiUtility.setNavigationUtility(context.navigationUtility);
        Keyboard.dismiss();

        if (
            formState.username && ('' + formState.username).trim().length > 0 &&
            formState.password && ('' + formState.password).trim().length > 0
        ) {

            loadingStatusSetter(true);
            try {
                apiUtility.login(formState.username, formState.password)
                    .then(function (loginData) {
                        if (loginData.user && loginData.user.authentication_token) {
                            handleLoginSuccess(loginData);
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
                            handleLoginError(error.message);
                        } else {
                            handleLoginError('An error occurred during login.');
                        }
                    });
            } catch (error) {
                handleLoginError(error);
            }
        } else {
            context.messageDisplayerUtility.displayErrorMessage('Please enter both a username and a password.');
        }
    }

    function handleLoginSuccess(loginData) {
        var apiUtility = context.apiUtility;

        apiUtility.setToken(loginData.user.authentication_token);
        apiUtility.setLoginData(loginData);

        // fade out, then go to next screen
        Animated.timing(
            formState.viewOpacity,
            {
                toValue: 0.0,
                duration: 500,
                easing: Easing.linear,
                delay: 0,
                useNativeDriver: true,
            },
        ).start();

        formState.viewOpacity.addListener(() => {
            if (formState.viewOpacity._value === 0 && !startedLogin.current) {
                startedLogin.current = true;

                context.navigationUtility.navigateTo(
                    Constants.routes.home.name,
                    {afterLogin: true},
                );

                formState.viewOpacity.removeAllListeners();
            }
        });
    }

    function handleLoginError(error) {
        window.setTimeout(function () {
            loadingStatusSetter(false);
            context.messageDisplayerUtility.displayErrorMessage(error);
        }, 0);
    }


    let underlineColorAndroid = 'transparent';

    return (
        <View style={style.screenFrame}>
            <TouchableWithoutFeedback
                style={style.fullWindow}
                onPress={onTouchOutsideInput}
            >
                <View style={[style.columnView, style.loginScreenContainer]}>
                    {(() => {
                        if (formState.showPageContent) {
                            return (
                                <Animated.View style={[
                                    style.frameViewStyle,
                                    {opacity: formState.viewOpacity},
                                ]}>
                                    <TouchableWithoutFeedback
                                        style={[style.fullWindow, style.loginWindow]}
                                        onPress={onTouchOutsideInput}>
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
                                                            value={formState.username}
                                                            onChangeText={handleValueChange.bind(null, 'username')}
                                                            placeholder="Username"
                                                            returnKeyType="next"
                                                            onSubmitEditing={handleUsernameSubmit}
                                                        />
                                                        <TextInput
                                                            allowFontScaling={false}
                                                            autoCorrect={false}
                                                            autoCapitalize="none"
                                                            autoComplete="off"
                                                            underlineColorAndroid={underlineColorAndroid}
                                                            ref={passwordField}
                                                            secureTextEntry={true}
                                                            style={[
                                                                style.defaultTextInput,
                                                                style.loginPageTextInput,
                                                                style.loginPagePassword,
                                                            ]}
                                                            value={formState.password}
                                                            onChangeText={handleValueChange.bind(null, 'password')}
                                                            placeholder="Password"
                                                            returnKeyType="go"
                                                            onSubmitEditing={login}
                                                        />

                                                        <TouchableOpacity
                                                            onPress={login}
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
