import React, {useContext, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Animated, Easing} from 'react-native';
import {colors} from '../Styles/style';
import {withContext} from './GlobalContextConsumerComponent';
import {GlobalContext} from '../AppFrame';

export let OverlayLoadingIndicator = function (props) {
    const mounted = useRef(true);
    const context = useContext(GlobalContext);
    context.loadingStatusValueManager.reactToValueChangeWith(processLoadingStatusValueChange);
    let style = context.style;

    const [loadingIndicatorState, setLoadingIndicatorState] = useState({
        loading: false,
        viewOpacity: new Animated.Value(0.0),
    });

    function mergeToLoadingIndicatorState(stateChange) {
        if (stateChange) {
            setLoadingIndicatorState(
                {
                    ...loadingIndicatorState,
                    ...stateChange,
                },
            );
        }
    }

    // track whether or not this is mounted
    useEffect(function () {
        mounted.current = true;

        return function () {
            mounted.current = false;
        };
    }, []);

    function processLoadingStatusValueChange(loading) {
        if (loadingIndicatorState.loading !== loading) {
            window.setTimeout(function () {
                if (mounted.current) {
                    Animated.timing(
                        loadingIndicatorState.viewOpacity,
                        {
                            toValue: 1.0,
                            duration: 1000,
                            easing: Easing.linear,
                            delay: 0,
                            useNativeDriver: true,
                        },
                    ).start();

                    mergeToLoadingIndicatorState({
                        loading: loading,
                    });
                }
            }, 0);
        }
    }

    if (loadingIndicatorState.loading) {
        return (
            <Animated.View style={[
                style.loadingIndicatorOverlay,
                {opacity: loadingIndicatorState.viewOpacity},
            ]}>
                <ActivityIndicator
                    style={[
                        style.loadingIndicator,
                        {bottom: context.statusBarHeightValueManager.value},
                    ]}
                    color={colors.moss}
                    size="large"
                />
            </Animated.View>
        );
    } else {
        return null;
    }
};
