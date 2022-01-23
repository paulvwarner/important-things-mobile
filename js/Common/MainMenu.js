import {TouchableOpacity, View} from 'react-native';
import React, {useContext} from 'react';
import {DefaultText} from './DefaultText';
import {Constants} from './Constants';
import {AuthUtility} from './AuthUtility';
import {GlobalContext} from '../AppFrame';

var _ = require('underscore');

export let MainMenu = function (props) {
    const context = useContext(GlobalContext);
    let style = context.style;
    const routes = Constants.routes;

    function navigateTo(route, routeParams) {
        if (route && route.name && route.name === Constants.routes.logout.name) {
            AuthUtility.logout(context.navigationUtility);

            if (props.postNavigateCallback) {
                props.postNavigateCallback();
            }
        } else {
            context.navigationUtility.navigateTo(
                route.name,
            );

            if (props.postNavigateCallback) {
                props.postNavigateCallback();
            }
        }
    }

    const menuItems = [
        {
            route: routes.home,
            label: 'Home',
        },
        {
            route: routes.logout,
            label: 'Log Out',
        },
    ];

    let menuItemComponents = [];

    for (let i = 0; i < menuItems.length; i++) {
        var menuItem = menuItems[i];
        menuItemComponents.push(
            <View
                key={i}
                style={style.mainMenuOptionOuterContainer}
            >
                <TouchableOpacity
                    style={style.mainMenuOptionContainer}
                    onPress={navigateTo.bind(null, menuItem.route, menuItem.params)}
                >
                    <View style={style.mainMenuOptionContent}>
                        <DefaultText
                            style={style.mainMenuOptionLabelText}
                        >{menuItem.label}</DefaultText>
                    </View>
                </TouchableOpacity>
            </View>,
        );
    }

    return (
        <View style={style.mainMenuContainer}>
            {menuItemComponents}
        </View>
    );

};

