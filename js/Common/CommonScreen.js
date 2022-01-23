import React, {useContext, useEffect, useRef} from 'react';
import {View} from 'react-native';
import {CommonHeader} from './CommonHeader';
import {MainMenuPane} from './MainMenuPane';
import {GlobalContext} from '../AppFrame';
import {NotificationsUtility} from './NotificationsUtility';

export let CommonScreen = function (props) {
    const toggleMenu = useRef(null);
    const context = useContext(GlobalContext);
    let style = context.style;

    useEffect(function () {
        NotificationsUtility.requestUserPermission();
        NotificationsUtility.handleForegroundMessages();
        NotificationsUtility.subscribeToImportantThings();
    }, []);

    return (
        <View style={style.negativeFrameOver}>
            <CommonHeader
                toggleMenu={function () {
                    toggleMenu.current();
                }}
            />
            <View style={style.commonScreenContainer}>
                {props.children}
            </View>
            <MainMenuPane
                toggleMenu={toggleMenu}
            />
        </View>
    );
};
