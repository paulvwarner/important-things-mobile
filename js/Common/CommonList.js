import React, {Fragment, useContext} from 'react';
import {FlatList, View} from 'react-native';
import {DefaultText} from './DefaultText';
import {GlobalContext} from '../AppFrame';

export let CommonList = function (props) {
    const context = useContext(GlobalContext);
    let style = context.style;

    function renderCommitment({item, index, separators}) {
        return (
            <CommonListItem
                header={item[props.headerFieldName]}
                body={item[props.bodyFieldName]}
            />
        );
    }

    let listDisplay = null;
    if (props.list.modelList && props.list.modelList.length > 0) {
        listDisplay = (
            <FlatList
                scrollIndicatorInsets={{right: 1}}
                style={style.commonFlatList}
                contentContainerStyle={style.commonFlatListScrollContent}
                data={props.list.modelList}
                renderItem={renderCommitment}
            />
        );
    }

    return (
        <View style={style.commonListContainer}>
            {listDisplay}
        </View>
    );
};

let CommonListItem = function (props) {
    const context = useContext(GlobalContext);
    let style = context.style;

    return (
        <View style={style.commonListItem}>
            <DefaultText
                style={style.commonListItemHeaderText}
            >{props.header}</DefaultText>
            {(() => {
                if (props.body) {
                    return (
                        <Fragment>
                            <View style={style.commonListItemDivider}/>
                            <DefaultText
                                style={style.commonListItemBodyText}
                            >{props.body}</DefaultText>
                        </Fragment>
                    );
                }
            })()}
        </View>
    );
};
