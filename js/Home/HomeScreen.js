import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import {DefaultText} from '../Common/DefaultText';
import {withContext} from '../Common/GlobalContextConsumerComponent';
import {AuthUtility} from '../Common/AuthUtility';
import {NotificationsUtility} from '../Common/NotificationsUtility';
import {CommonScreen} from '../Common/CommonScreen';

export var HomeScreen = withContext(class extends React.Component {
    constructor(props) {
        super(props);

        NotificationsUtility.requestUserPermission();
        NotificationsUtility.handleForegroundMessages();
        NotificationsUtility.subscribeToImportantThings();

        this.loadingStatusSetter = props.context.loadingStatusValueManager.createValueSetter();
        this.loadingStatusSetter(false);
    }

    render = () => {
        let style = this.props.context.style;
        return (
            <View style={style.screenFrame}>
                <CommonScreen>
                    <View style={style.homeScreenContainer}>
                        <DefaultText>PVW TODO HOMESCREEN</DefaultText>
                        <TouchableOpacity
                            onPress={AuthUtility.logout.bind(this, this.props.context.navigationUtility)}
                        >
                            <View>
                                <DefaultText>LOG OUT</DefaultText>
                            </View>
                        </TouchableOpacity>
                    </View>
                </CommonScreen>
            </View>
        );
    };
});
