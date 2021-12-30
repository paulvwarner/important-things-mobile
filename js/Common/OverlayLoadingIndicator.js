import React from 'react';
import {ActivityIndicator, Animated, Easing} from 'react-native';
import {colors} from '../Styles/style';
import {withContext} from './GlobalContextConsumerComponent';

export let OverlayLoadingIndicator = withContext(class extends React.Component {
    constructor(props) {
        super(props);

        if (props.context.loadingStatusValueManager) {
            props.context.loadingStatusValueManager.reactToValueChangeWith(this.processLoadingStatusValueChange);
        }

        this.state = {
            loading: false,
            viewOpacity: new Animated.Value(0.0),
        };
    };

    componentDidMount = () => {
        this.mounted = true;
    };

    componentWillUnmount = () => {
        this.mounted = false;
    };

    processLoadingStatusValueChange = (loading) => {
        if (this.state) {
            let self = this;

            if (this.state.loading !== loading) {
                // do the state change after all current in-progress rendering is complete (timeout ensures this)
                window.setTimeout(function () {
                    if (self.mounted) {
                        Animated.timing(
                            self.state.viewOpacity,
                            {
                                toValue: 1.0,
                                duration: 1000,
                                easing: Easing.linear,
                                delay: 0,
                                useNativeDriver: true,
                            },
                        ).start();

                        self.setState({
                            loading: loading,
                        });
                    }
                }, 0);
            }
        }
    };

    render = () => {
        let style = this.props.context.style;
        if (this.state.loading) {
            return (
                <Animated.View style={[
                    style.loadingIndicatorOverlay,
                    {opacity: this.state.viewOpacity},
                ]}>
                    <ActivityIndicator
                        style={style.loadingIndicator}
                        color={colors.black}
                        size="large"
                    />
                </Animated.View>
            );
        } else {
            return null;
        }
    };
});
