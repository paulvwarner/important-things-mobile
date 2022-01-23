import {View} from 'react-native';
import React, {useContext, useEffect} from 'react';
import {DefaultText} from '../Common/DefaultText';
import {NotificationsUtility} from '../Common/NotificationsUtility';
import {CommonScreen} from '../Common/CommonScreen';
import {GlobalContext} from '../AppFrame';

export let HomeScreen = function (props) {
    const context = useContext(GlobalContext);
    let style = context.style;
    let loadingStatusSetter = context.loadingStatusValueManager.createValueSetter();
    loadingStatusSetter(false);

    useEffect(function () {
        NotificationsUtility.requestUserPermission();
        NotificationsUtility.handleForegroundMessages();
        NotificationsUtility.subscribeToImportantThings();
    }, []);

    return (
        <View style={style.screenFrame}>
            <CommonScreen>
                <View style={style.homeScreenContainer}>
                    <DefaultText>PVW TODO HOMESCREEN</DefaultText>
                </View>
            </CommonScreen>
        </View>
    );
};
