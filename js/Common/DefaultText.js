import React, {useContext} from 'react';
import {Text} from 'react-native';
import {GlobalContext} from '../AppFrame';

export let DefaultText = function (props) {
    const context = useContext(GlobalContext);
    return (
        <Text
            allowFontScaling={false}
            style={[context.style.defaultText, props.style]}
            numberOfLines={props.numberOfLines}
            adjustsFontSizeToFit={props.adjustsFontSizeToFit}
        >
            {'' + props.children}
        </Text>
    );
};

