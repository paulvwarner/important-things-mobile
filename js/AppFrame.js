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
import React, {Component} from 'react';
import 'react-native-gesture-handler';
import {MessageDisplayerUtility} from './Common/MessageDisplayerUtility';
import {AccessibilityUtility} from './Common/AccessibilityUtility';
import {NavigationUtility} from './Common/NavigationUtility';
import {ApiUtility} from './Api/ApiUtility';

let _ = require('underscore');
export let GlobalContext = React.createContext({});

let loadingStatusValueManager = new CrossComponentValueManager();
let statusBarHeightValueManager = new CrossComponentValueManager();

export let AppFrame = class extends Component {
    constructor(props) {
        super(props);
        let self = this;

        statusBarHeightValueManager.value = styleFunctions.getMinimumStatusBarHeight();
        this.statusBarHeightSetter = statusBarHeightValueManager.createValueSetter();

        self.setupAppFrame();

        // fade in app content for android since splash "screen" is defined as a theme
        let containerOpacity = 1;
        if (Platform.OS === 'android') {
            containerOpacity = 0;
        }

        this.state = {
            style: null,
            dimensions: null,
            textSizeMultiplier: null,
            globalSettings: null,
            containerOpacity: new Animated.Value(containerOpacity),
        };
    }

    componentDidMount = () => {
        let self = this;

        if (Platform.OS === 'ios') {
            NativeModules.StatusBarManager.getHeight((statusBarHeight) => {
                self.statusBarHeightSetter(statusBarHeight.height);
            });
        } else {
            self.statusBarHeightSetter(StatusBar.currentHeight);

            window.setTimeout(function () {
                Animated.timing(
                    self.state.containerOpacity,
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
    };

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

    setupAppFrame = () => {
        let self = this;
        AccessibilityUtility.getTextMultiplier()
            .then(function (textMultiplier) {
                let globalSettings = getGlobalSettings();
                let dimensions = constructDimensions(textMultiplier);
                let messageDisplayerUtility = new MessageDisplayerUtility();
                let navigationUtility = new NavigationUtility();
                var apiUtility = new ApiUtility();
                apiUtility.setGlobalSettings(globalSettings);

                self.setState({
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
    };

    render = () => {
        if (this.state.style) {
            let style = this.state.style;
            let showErrorDetails = false;

            if (this.state.globalSettings && this.state.globalSettings.environment !== 'production') {
                showErrorDetails = true;
            }

            if (this.state.hasError) {
                return (
                    <View style={[style.container]}>
                        <ScrollView
                            style={[style.errorPage]}
                            contentContainerStyle={style.errorPageContentContainer}
                            scrollIndicatorInsets={{right: 1}}
                        >
                            <View style={[style.errorPageScrollContent]}>
                                <Text style={[style.errorPageText]}>An error occurred.</Text>
                                {(() => {
                                    if (this.state.componentDidCatchError && showErrorDetails) {
                                        return (
                                            <Text
                                                style={[style.errorPageText]}
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
                                                style={[style.errorPageText]}
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
                let statusBarBackgroundColor = colors.black;

                return (
                    <Animated.View
                        style={[style.container, {opacity: this.state.containerOpacity}]}
                        renderToHardwareTextureAndroid={true}
                    >
                        <View style={style.statusBarOuterContainer}>
                            <SafeAreaView
                                backgroundColor={statusBarBackgroundColor}
                                style={style.safeAreaViewWrapper}
                            />
                            <StatusBar
                                backgroundColor={statusBarBackgroundColor}
                                barStyle={"light-content"}
                            />
                        </View>
                        <GlobalContext.Provider
                            value={{
                                style: style,
                                dimensions: this.state.dimensions,
                                textSizeMultiplier: this.state.textSizeMultiplier,
                                globalSettings: this.state.globalSettings,
                                apiUtility: this.state.apiUtility,
                                messageDisplayerUtility: this.state.messageDisplayerUtility,
                                navigationUtility: this.state.navigationUtility,
                                loadingStatusValueManager: this.state.loadingStatusValueManager,
                                statusBarHeightValueManager: this.state.statusBarHeightValueManager,
                            }}
                        >
                            <AppRoutes
                                statusBarHeightValueManager={statusBarHeightValueManager}
                            />
                        </GlobalContext.Provider>
                    </Animated.View>
                );
            }
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
};
