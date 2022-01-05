import React from 'react';
import {Animated, Dimensions, Easing, Image, View} from 'react-native';
import {withContext} from './GlobalContextConsumerComponent';
import {MainMenu} from './MainMenu';
import {DefaultText} from './DefaultText';
import DeviceInfo from 'react-native-device-info';

export var MainMenuPane = withContext(class extends React.Component {
    constructor(props) {
        super(props);
        var self = this;
        var dimensions = props.context.dimensions;

        this.menuHiddenLeft = -1 * dimensions.mainMenuPaneWidth;
        this.leftOffsetValue = this.menuHiddenLeft;
        this.menuShowingLeft = 0;

        this.state = {
            leftOffset: new Animated.Value(this.menuHiddenLeft),
        };
        this.state.leftOffset.addListener(({value}) => self.leftOffsetValue = value);
    }

    componentDidMount = () => {
        if (this.props.passRef) {
            this.props.passRef(this);
        }
    };

    toggleMenu = () => {
        var self = this;
        window.setTimeout(function () {
            if (self.leftOffsetValue === self.menuHiddenLeft) {
                self.openMenu();
            } else {
                self.closeMenu();
            }
        }, 0);
    };

    openMenu = () => {
        Animated.timing(
            this.state.leftOffset,
            {
                toValue: this.menuShowingLeft,
                duration: 150,
                easing: Easing.inOut(Easing.ease),
                delay: 0,
                useNativeDriver: true,
            },
        ).start();
    };

    closeMenu = () => {
        Animated.timing(
            this.state.leftOffset,
            {
                toValue: this.menuHiddenLeft,
                duration: 150,
                easing: Easing.inOut(Easing.ease),
                delay: 0,
                useNativeDriver: true,
            },
        ).start();
    };

    render = () => {
        var self = this;
        var style = this.props.context.style;
        var dimensions = this.props.context.dimensions;
        var appVersionText = 'App Version ' +
            DeviceInfo.getReadableVersion() +
            '  (' +
            this.props.context.globalSettings.environment.toUpperCase() +
            ')';

        return (
            <View style={style.mainMenuPaneContainer} pointerEvents="box-none">
                <Animated.View
                    style={[
                        style.mainMenuPane,
                        {
                            transform: [{translateX: this.state.leftOffset}],
                            height: Dimensions.get('window').height -
                                dimensions.commonScreenHeaderHeight -
                                this.props.context.statusBarHeightValueManager.value,
                        },
                    ]}
                    transparent={true}
                >
                    <View style={style.mainMenuPaneContent}>
                        <View style={style.mainMenuOptionsContainer}>
                            <MainMenu
                                postNavigateCallback={function () {
                                    self.closeMenu();
                                }}
                            />
                        </View>
                        <View
                            style={[
                                style.mainMenuBottomContent,
                                {marginBottom: dimensions.gestureBarPaddingIOS},
                            ]}
                        >
                            <Image
                                style={style.mainMenuLogo}
                                source={require('../../images/logo.png')}
                            />
                            <DefaultText
                                style={style.mainMenuAppVersionText}
                            >{appVersionText}</DefaultText>
                        </View>
                    </View>
                </Animated.View>
            </View>
        );
    };
});

