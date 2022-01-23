import {createNavigationContainerRef, NavigationContainer, StackActions} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {View} from 'react-native';
import React, {useContext, useEffect} from 'react';
import {Constants} from './Common/Constants';
import {MessageDisplayingComponent} from './Common/MessageDisplayer';
import {LoginScreen} from './Login/LoginScreen';
import {ImportantThingsListScreen} from './ImportantThings/ImportantThingsListScreen';
import {GlobalContext} from './AppFrame';
import {CommitmentsListScreen} from './Commitments/CommitmentsListScreen';
import {AffirmationsListScreen} from './Affirmations/AffirmationsListScreen';

let _ = require('underscore');
const navigationRef = createNavigationContainerRef();

export let AppRoutes = function (props) {
    const context = useContext(GlobalContext);
    let style = context.style;

    useEffect(function () {
        // set up navigator
        const navigator = {
            navigateTo: function (routeName, params) {
                if (navigationRef.isReady()) {
                    navigationRef.navigate(routeName, params);
                }
            },
            goBack: function () {
                if (navigationRef.isReady()) {
                    navigationRef.dispatch(StackActions.pop());
                }
            },
        };

        context.navigationUtility.setNavigator(navigator);
    }, []);

    return (
        <MessageDisplayingComponent
            style={style.fullWindow}
            renderer={(messageDisplayer) => {
                context.messageDisplayerUtility.setMessageDisplayer(messageDisplayer);
                const Stack = createStackNavigator();

                return (
                    <View style={style.screenFrame}>
                        <NavigationContainer ref={navigationRef}>
                            <Stack.Navigator
                                initialRouteName={Constants.routes.login.name}
                                screenOptions={{headerShown: false}}
                            >
                                <Stack.Screen
                                    name={Constants.routes.login.name}
                                    component={LoginScreen}
                                    options={{
                                        gestureEnabled: false,
                                    }}
                                />
                                <Stack.Screen
                                    name={Constants.routes.importantThings.name}
                                    component={ImportantThingsListScreen}
                                    options={{
                                        gestureEnabled: false,
                                    }}
                                />
                                <Stack.Screen
                                    name={Constants.routes.commitments.name}
                                    component={CommitmentsListScreen}
                                    options={{
                                        gestureEnabled: false,
                                    }}
                                />
                                <Stack.Screen
                                    name={Constants.routes.affirmations.name}
                                    component={AffirmationsListScreen}
                                    options={{
                                        gestureEnabled: false,
                                    }}
                                />
                            </Stack.Navigator>
                        </NavigationContainer>
                    </View>
                );
            }}
        >

        </MessageDisplayingComponent>
    );
};


