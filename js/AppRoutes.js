import {createAppContainer, NavigationActions} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {View} from 'react-native';
import React from 'react';
import {Constants} from './Common/Constants';
import {MessageDisplayingComponent} from './Common/MessageDisplayer';
import {withContext} from './Common/GlobalContextConsumerComponent';
import {LoginScreen} from './Login/LoginScreen';

let _ = require('underscore');

export let AppRoutes = withContext(class extends React.Component {
    constructor(props) {
        super(props);
        let appRoutesComponent = this;

        // set up navigator
        props.context.navigationUtility.setNavigator(
            {
                navigateTo: function (routeName, params) {
                    this.commonNavigate(routeName, params, 'navigate');
                },
                goBack: function (routeName, params) {
                    this.commonNavigate(null, null, 'back');
                },
                commonNavigate: function (routeName, params, navFunctionName) {
                    let navigationAction;
                    if (routeName) {
                        navigationAction = NavigationActions[navFunctionName]({
                            routeName: routeName,
                            params: (params || {}),
                        });
                    } else {
                        navigationAction = NavigationActions[navFunctionName]();
                    }
                    appRoutesComponent.navigator && appRoutesComponent.navigator.dispatch(navigationAction);
                },
            },
        );
    }

    render = () => {
        let self = this;
        let style = this.props.context.style;

        return (
            <MessageDisplayingComponent
                style={this.props.context.style.fullWindow}
                renderer={(messageDisplayer) => {
                    self.props.context.messageDisplayerUtility.setMessageDisplayer(messageDisplayer);

                    let commonRouteParams = {};

                    let initialRoute = Constants.routes.login;

                    let stackNavigatorConfig = {
                        headerMode: 'none',
                        initialRouteName: initialRoute.name,
                    };

                    const AppNavigator = createStackNavigator(
                        {
                            [Constants.routes.login.name]: {
                                screen: LoginScreen,
                                params: commonRouteParams,
                                navigationOptions: {
                                    gesturesEnabled: false,
                                },
                            },
                        },
                        stackNavigatorConfig,
                    );

                    const AppNavigationContainer = createAppContainer(AppNavigator);

                    return (
                        <View style={style.screenFrame}>
                            <AppNavigationContainer
                                ref={(elem) => {
                                    this.navigator = elem;
                                }}
                            />
                        </View>
                    );
                }}
            >

            </MessageDisplayingComponent>
        );
    };
});

