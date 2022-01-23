import {FlatList, View} from 'react-native';
import React, {Fragment, useContext, useEffect} from 'react';
import {DefaultText} from '../Common/DefaultText';
import {NotificationsUtility} from '../Common/NotificationsUtility';
import {CommonScreen} from '../Common/CommonScreen';
import {GlobalContext} from '../AppFrame';
import {useCommonListEffects} from '../Common/CommonListHooks';

export let ImportantThingsListScreen = function (props) {
    const context = useContext(GlobalContext);
    let style = context.style;
    let loadingStatusSetter = context.loadingStatusValueManager.createValueSetter();

    useEffect(function () {
        NotificationsUtility.requestUserPermission();
        NotificationsUtility.handleForegroundMessages();
        NotificationsUtility.subscribeToImportantThings();
    }, []);

    const [list] = useCommonListEffects(
        props,
        'importantThingId',
        context.apiUtility.getImportantThingsList.bind(context.apiUtility),
        'important thing',
        loadingStatusSetter,
    );

    function renderImportantThing({item, index, separators}) {
        return (
            <View style={style.commonListItem}>
                <DefaultText
                    style={style.commonListItemHeaderText}
                >{item.message}</DefaultText>
                {(() => {
                    if (item.notes) {
                        return (
                            <Fragment>
                                <View style={style.commonListItemDivider}/>
                                <DefaultText
                                    style={style.commonListItemBodyText}
                                >{item.notes}</DefaultText>
                            </Fragment>
                        );
                    }
                })()}

            </View>
        );
    }

    let listDisplay = null;
    if (list.modelList && list.modelList.length > 0) {
        listDisplay = (
            <FlatList
                scrollIndicatorInsets={{right: 1}}
                style={style.commonFlatList}
                contentContainerStyle={style.commonFlatListScrollContent}
                data={list.modelList}
                renderItem={renderImportantThing}
            />
        );
    }

    return (
        <View style={style.screenFrame}>
            <CommonScreen>
                <View style={style.importantThingsListScreenContainer}>
                    {listDisplay}
                </View>
            </CommonScreen>
        </View>
    );
};
