import {View} from 'react-native';
import React, {useContext} from 'react';
import {CommonScreen} from '../Common/CommonScreen';
import {GlobalContext} from '../AppFrame';
import {useCommonListEffects} from '../Common/CommonListHooks';
import {CommonList} from '../Common/CommonList';

export let ImportantThingsListScreen = function (props) {
    const context = useContext(GlobalContext);
    let style = context.style;
    let loadingStatusSetter = context.loadingStatusValueManager.createValueSetter();

    const [list] = useCommonListEffects(
        props,
        'importantThingId',
        context.apiUtility.getImportantThingsList.bind(context.apiUtility),
        'important thing',
        loadingStatusSetter,
    );

    return (
        <View style={style.screenFrame}>
            <CommonScreen>
                <CommonList
                    headerFieldName="message"
                    bodyFieldName="notes"
                    list={list}
                />
            </CommonScreen>
        </View>
    );
};
