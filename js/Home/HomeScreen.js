import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import {DefaultText} from '../Common/DefaultText';
import {withContext} from '../Common/GlobalContextConsumerComponent';
import {AuthUtility} from '../Common/AuthUtility';

export var HomeScreen = withContext(class extends React.Component {
    constructor(props) {
        super(props);
        this.loadingStatusSetter = props.context.loadingStatusValueManager.createValueSetter();
        this.loadingStatusSetter(false);
    }

    render = () => {
        return (
            <View>
                <DefaultText>PVW TODO HOMESCREEN</DefaultText>
                <TouchableOpacity onPress={AuthUtility.logout.bind(this,this.props.context.navigationUtility)}><View><DefaultText>LOG OUT</DefaultText></View></TouchableOpacity>
            </View>
        );
    };
});