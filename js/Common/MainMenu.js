import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import {DefaultText} from './DefaultText';
import {withContext} from './GlobalContextConsumerComponent';
import {Constants} from './Constants';
import {AuthUtility} from './AuthUtility';

var _ = require('underscore');

export var MainMenu = withContext(class extends React.Component {
    navigateTo = (route, routeParams) => {
        var self = this;
        if (route && route.name && route.name === Constants.routes.logout.name) {
            AuthUtility.logout(self.props.context.navigationUtility);

            if (this.props.postNavigateCallback) {
                this.props.postNavigateCallback();
            }
        } else {
            this.props.context.navigationUtility.navigateTo(
                route.name,
            );

            if (this.props.postNavigateCallback) {
                this.props.postNavigateCallback();
            }
        }
    };

    render = () => {
        var style = this.props.context.style;
        const routes = Constants.routes;

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

        var menuItemComponents = [];

        for (var i = 0; i < menuItems.length; i++) {
            var menuItem = menuItems[i];
            menuItemComponents.push(
                <View
                    key={i}
                    style={style.mainMenuOptionOuterContainer}
                >
                    <TouchableOpacity
                        style={style.mainMenuOptionContainer}
                        onPress={this.navigateTo.bind(this, menuItem.route, menuItem.params)}
                    >
                        <View style={style.mainMenuOptionContent}>
                                <DefaultText
                                    style={style.mainMenuOptionLabelText}
                                >{menuItem.label}</DefaultText>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }

        return (
            <View style={style.mainMenuContainer}>
                {menuItemComponents}
            </View>
        );
    }
});

