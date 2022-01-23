import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Easing,
    NativeModules,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    View,
} from 'react-native';
import {AppRoutes} from './AppRoutes';
import {getGlobalSettings} from './Common/GlobalSettingsManager';
import {CrossComponentValueManager} from './Common/CrossComponentValueManager';
import {colors, constructDimensions, constructStyle, styleFunctions} from './Styles/style';
import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import {MessageDisplayerUtility} from './Common/MessageDisplayerUtility';
import {AccessibilityUtility} from './Common/AccessibilityUtility';
import {NavigationUtility} from './Common/NavigationUtility';
import {ApiUtility} from './Api/ApiUtility';

let _ = require('underscore');
export let GlobalContext = React.createContext({});

let loadingStatusValueManager = new CrossComponentValueManager();
let statusBarHeightValueManager = new CrossComponentValueManager(styleFunctions.getMinimumStatusBarHeight());

export let AppFrame = function (props) {
    let statusBarHeightSetter = statusBarHeightValueManager.createValueSetter();

    // fade in app content for android since splash "screen" is defined as a theme
    let containerOpacity = 1;
    if (Platform.OS === 'android') {
        containerOpacity = 0;
    }

    let [frameState, setFrameState] = useState({
        style: null,
        dimensions: null,
        textSizeMultiplier: null,
        globalSettings: null,
        containerOpacity: new Animated.Value(containerOpacity),
    });

    function mergeToFrameState(stateChange) {
        if (stateChange) {
            setFrameState(
                {
                    ...frameState,
                    ...stateChange,
                },
            );
        }
    }

    useEffect(function () {
        setupAppFrame();

        if (Platform.OS === 'ios') {
            NativeModules.StatusBarManager.getHeight((statusBarHeight) => {
                statusBarHeightSetter(statusBarHeight.height);
            });
        } else {
            statusBarHeightSetter(StatusBar.currentHeight);

            window.setTimeout(function () {
                Animated.timing(
                    frameState.containerOpacity,
                    {
                        toValue: 1,
                        duration: 1000,
                        easing: Easing.linear,
                        delay: 0,
                        useNativeDriver: true,
                    },
                ).start();
            }, 0);
        }
    }, []);

    function setupAppFrame() {
        AccessibilityUtility.getTextMultiplier()
            .then(function (textMultiplier) {
                let globalSettings = getGlobalSettings();
                let dimensions = constructDimensions(textMultiplier);
                let messageDisplayerUtility = new MessageDisplayerUtility();
                let navigationUtility = new NavigationUtility();
                var apiUtility = new ApiUtility();
                apiUtility.setGlobalSettings(globalSettings);

                mergeToFrameState({
                    style: constructStyle(textMultiplier, dimensions),
                    dimensions: dimensions,
                    textSizeMultiplier: textMultiplier,
                    globalSettings: globalSettings,
                    apiUtility: apiUtility,
                    messageDisplayerUtility: messageDisplayerUtility,
                    navigationUtility: navigationUtility,
                    loadingStatusValueManager: loadingStatusValueManager,
                    statusBarHeightValueManager: statusBarHeightValueManager,
                });
            })
            .catch(function (error) {
                console.log('Error setting up app frame: ', error);
            });
    }

    if (frameState.style) {
        let style = frameState.style;
        let statusBarBackgroundColor = colors.black;
        let context = {
            style: style,
            dimensions: frameState.dimensions,
            textSizeMultiplier: frameState.textSizeMultiplier,
            globalSettings: frameState.globalSettings,
            apiUtility: frameState.apiUtility,
            messageDisplayerUtility: frameState.messageDisplayerUtility,
            navigationUtility: frameState.navigationUtility,
            loadingStatusValueManager: frameState.loadingStatusValueManager,
            statusBarHeightValueManager: frameState.statusBarHeightValueManager,
        };

        return (
            <ErrorBoundary
                globalSettings={frameState.globalSettings}
                style={style}
            >
                <Animated.View
                    style={[style.container, {opacity: frameState.containerOpacity}]}
                    renderToHardwareTextureAndroid={true}
                >
                    <View style={style.statusBarOuterContainer}>
                        <SafeAreaView
                            backgroundColor={statusBarBackgroundColor}
                            style={style.safeAreaViewWrapper}
                        />
                        <StatusBar
                            backgroundColor={statusBarBackgroundColor}
                            barStyle={'light-content'}
                        />
                    </View>
                    <GlobalContext.Provider value={context}>
                        <AppRoutes
                            statusBarHeightValueManager={statusBarHeightValueManager}
                        />
                    </GlobalContext.Provider>
                </Animated.View>
            </ErrorBoundary>
        );
    } else {
        return (
            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'flex-start',
                backgroundColor: colors.white,
            }}>
                <StatusBar barStyle="light-content"/>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    height: Dimensions.get('window').height,
                    alignItems: 'center',
                }}>
                    <ActivityIndicator
                        style={{
                            backgroundColor: 'transparent',
                            padding: 15,
                            borderRadius: 10,
                        }}
                        color={colors.black}
                        size="large"
                    />
                </View>
            </View>
        );
    }
};

let ErrorBoundary = class extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasError: false,
            unhandledError: null,
            componentDidCatchError: null,
            componentDidCatchInfo: null,
        };
    }

    static getDerivedStateFromError(error) {
        // show the fallback error screen
        return {
            hasError: true,
            unhandledError: _.clone(error),
        };
    }

    componentDidCatch(error, info) {
        let self = this;

        self.setState({
            componentDidCatchError: error,
            componentDidCatchInfo: info,
        });
    };

    render = () => {
        if (this.state.hasError) {
            let style = this.props.style;
            let showErrorDetails = false;

            if (this.props.globalSettings && this.props.globalSettings.environment !== 'production') {
                showErrorDetails = true;
            }

            return (
                <View style={[style.container]}>
                    <ScrollView
                        style={[style.errorPage]}
                        contentContainerStyle={style.errorPageContentContainer}
                        scrollIndicatorInsets={{right: 1}}
                    >
                        <View style={style.errorPageScrollContent}>
                            <Text style={style.errorPageText}>An error occurred.</Text>
                            {(() => {
                                if (this.state.componentDidCatchError && showErrorDetails) {
                                    return (
                                        <Text
                                            style={style.errorPageText}
                                        >{
                                            'ComponentDidCatch Error: ' +
                                            JSON.stringify(this.state.componentDidCatchError)
                                        }</Text>
                                    );
                                }
                            })()}
                            {(() => {
                                if (this.state.componentDidCatchInfo && showErrorDetails) {
                                    return (
                                        <Text
                                            style={style.errorPageText}
                                        >{
                                            'ComponentDidCatch Info: ' +
                                            JSON.stringify(this.state.componentDidCatchInfo)
                                        }</Text>
                                    );
                                }
                            })()}
                        </View>
                    </ScrollView>
                </View>
            );
        } else {
            return this.props.children;
        }
    };
};
