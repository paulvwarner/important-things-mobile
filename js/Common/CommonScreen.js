import React, {useContext, useRef} from 'react';
import {View} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {CommonHeader} from './CommonHeader';
import {MainMenuPane} from './MainMenuPane';
import {GlobalContext} from '../AppFrame';

export let CommonScreen = function (props) {
    const mainMenuPane = useRef(null);
    const context = useContext(GlobalContext);
    let style = context.style;

    function toggleMenu() {
        mainMenuPane.current.toggleMenu();
    }

    return (
        <View style={style.negativeFrameOver}>
            <NavigationEvents
                onWillFocus={props.onWillFocus || (() => null)}
            />
            <CommonHeader
                toggleMenu={toggleMenu}
            />
            <View style={style.commonScreenContainer}>
                {props.children}
            </View>
            <MainMenuPane
                passRef={(elem) => {
                    mainMenuPane.current = elem;
                }}
            />
        </View>
    );
};
