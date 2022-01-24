import {TouchableOpacity, View} from 'react-native';
import React, {useContext} from 'react';
import {DefaultText} from './DefaultText';
import {Constants} from './Constants';
import {AuthUtility} from './AuthUtility';
import {GlobalContext} from '../AppFrame';
import {useRoute} from '@react-navigation/native';

var _ = require('underscore');

export let MainMenu = function (props) {
    const context = useContext(GlobalContext);
    let style = context.style;
    const routes = Constants.routes;
    let currentRoute = useRoute();

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
            route: routes.importantThings,
            label: 'Important Things',
        },
        {
            route: routes.commitments,
            label: 'Commitments',
        },
        {
            route: routes.affirmations,
            label: 'Affirmations',
        },
        {
            route: routes.logout,
            label: 'Log Out',
        },
    ];

    let menuItemComponents = [];

    for (let i = 0; i < menuItems.length; i++) {
        let menuItem = menuItems[i];
        let optionContainerStyle = [style.mainMenuOptionContainer];
        let optionTextStyle=[style.mainMenuOptionLabelText];

        if (currentRoute.name === menuItem.route.name) {
            optionContainerStyle.push(style.selectedMainMenuOptionContainer);
            optionTextStyle.push(style.selectedMainMenuOptionLabelText);
        }

        menuItemComponents.push(
            <View
                key={i}
                style={style.mainMenuOptionOuterContainer}
            >
                <TouchableOpacity
                    style={optionContainerStyle}
                    onPress={navigateTo.bind(null, menuItem.route, menuItem.params)}
                >
                    <View style={style.mainMenuOptionContent}>
                        <DefaultText
                            style={optionTextStyle}
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

