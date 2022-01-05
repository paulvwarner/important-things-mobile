import React from 'react';
import {View} from 'react-native';
import {withContext} from './GlobalContextConsumerComponent';
import {NavigationEvents} from 'react-navigation';
import {CommonHeader} from './CommonHeader';
import {MainMenuPane} from './MainMenuPane';

export var CommonScreen = withContext(class extends React.Component {
    toggleMenu = () => {
        this.mainMenuPane.toggleMenu();
    };

    render = () => {
        var self = this;
        let style = this.props.context.style;
        return (
            <View style={style.negativeFrameOver}>
                <NavigationEvents
                    onWillFocus={this.props.onWillFocus || (() => null)}
                />
                <CommonHeader
                    toggleMenu={this.toggleMenu}
                />
                <View style={style.commonScreenContainer}>
                    {this.props.children}
                </View>
                <MainMenuPane
                    passRef={(elem) => {
                        self.mainMenuPane = elem;
                    }}
                />
            </View>
        );
    };
});
