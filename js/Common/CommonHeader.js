import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {withContext} from './GlobalContextConsumerComponent';
import {AuthUtility} from './AuthUtility';
import {DefaultText} from './DefaultText';
import {SvgXml} from 'react-native-svg';
import hamburgerMenu from '../../images/bars-white.svg';

export var CommonHeader = withContext(class extends React.Component {
    render = () => {
        var style = this.props.context.style;

        return (
            <View style={style.commonScreenHeader}>
                <View style={style.commonScreenHeaderMain}>
                    <View style={style.commonScreenHeaderMainContent}>
                        <View style={style.commonScreenHeaderLeft}>
                            <View style={style.commonScreenHeaderTextContainer}>
                                <DefaultText
                                    style={style.commonScreenHeaderText}
                                >IMPORTANT THINGS</DefaultText>
                            </View>
                        </View>
                        <View style={style.commonScreenHeaderRight}>
                            <TouchableOpacity
                                style={style.headerMenuButton}
                                onPress={this.props.toggleMenu}
                            >
                                <View style={style.headerMenuImageContainer}>
                                    <SvgXml
                                        width="100%"
                                        height="100%"
                                        xml={hamburgerMenu}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    };
});
