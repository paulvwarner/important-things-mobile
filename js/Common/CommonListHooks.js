import React, {useEffect, useState} from 'react';
import {MessageDisplayerUtility} from './MessageDisplayerUtility';

export function useCommonListEffects(
    props, modelIdParam, listFetchApiFunction, modelName, loadingStatusSetter,
) {
    const [list, setList] = useState({
        modelList: [],
    });

    const [loadingListData, setLoadingListData] = useState(false);

    // reload list data on mount
    useEffect(
        function () {
            setLoadingListData(true);
        },
        [],
    );

    useEffect(function () {
        if (loadingListData) {
            listFetchApiFunction()
                .then(function (listData) {
                    setList({modelList: listData});
                    setLoadingListData(false);
                    loadingStatusSetter(false);
                })
                .catch(function (error) {
                    setLoadingListData(false);
                    loadingStatusSetter(false);
                    console && console.error(error);
                    MessageDisplayerUtility.displayErrorMessage(
                        'An error occurred while loading the ' + modelName + ' list.',
                    );
                });
        }
    }, [loadingListData]);

    return [list];
}
