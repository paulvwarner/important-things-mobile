import React from "react";
import {Text} from "react-native";
import {withContext} from './GlobalContextConsumerComponent';

export var DefaultText = withContext(class extends React.Component {
    render = function () {
        return (
            <Text
                allowFontScaling={false}
                style={[this.props.context.style.defaultText, this.props.style]}
                numberOfLines={this.props.numberOfLines}
                adjustsFontSizeToFit={this.props.adjustsFontSizeToFit}
            >
                {'' + this.props.children}
            </Text>
        );
    }
});

