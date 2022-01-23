import React, {useContext, useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, Easing, Image, View} from 'react-native';
import {MainMenu} from './MainMenu';
import {DefaultText} from './DefaultText';
import DeviceInfo from 'react-native-device-info';
import {GlobalContext} from '../AppFrame';

export let MainMenuPane = function (props) {
    const context = useContext(GlobalContext);
    let style = context.style;
    let dimensions = context.dimensions;

    const menuHiddenLeft = -1 * dimensions.mainMenuPaneWidth;
    const menuShowingLeft = 0;
    const leftOffsetValue = useRef(menuHiddenLeft);

    const [leftOffset, setLeftOffset] = useState(new Animated.Value(menuHiddenLeft));

    leftOffset.addListener(({value}) => leftOffsetValue.current = value);

    function toggleMenu() {
        window.setTimeout(function () {
            if (leftOffsetValue.current === menuHiddenLeft) {
                openMenu();
            } else {
                closeMenu();
            }
        }, 0);
    }

    // pass toggleMenu function to parent using ref defined in parent
    useEffect(function () {
        if (props.toggleMenu) {
            props.toggleMenu.current = toggleMenu;
        }
    }, []);

    function openMenu() {
        Animated.timing(
            leftOffset,
            {
                toValue: menuShowingLeft,
                duration: 150,
                easing: Easing.inOut(Easing.ease),
                delay: 0,
                useNativeDriver: true,
            },
        ).start();
    }

    function closeMenu() {
        Animated.timing(
            leftOffset,
            {
                toValue: menuHiddenLeft,
                duration: 150,
                easing: Easing.inOut(Easing.ease),
                delay: 0,
                useNativeDriver: true,
            },
        ).start();
    }

    let appVersionText = 'App Version ' +
        DeviceInfo.getReadableVersion() +
        '  (' +
        context.globalSettings.environment.toUpperCase() +
        ')';

    return (
        <View style={style.mainMenuPaneContainer} pointerEvents="box-none">
            <Animated.View
                style={[
                    style.mainMenuPane,
                    {
                        transform: [{translateX: leftOffset}],
                        height: Dimensions.get('window').height -
                            dimensions.commonScreenHeaderHeight -
                            context.statusBarHeightValueManager.value,
                    },
                ]}
                transparent={true}
            >
                <View style={style.mainMenuPaneContent}>
                    <View style={style.mainMenuOptionsContainer}>
                        <MainMenu
                            postNavigateCallback={closeMenu}
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
