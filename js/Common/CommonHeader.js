import React, {useContext} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {DefaultText} from './DefaultText';
import {SvgXml} from 'react-native-svg';
import hamburgerMenu from '../../images/bars-white.svg';
import {GlobalContext} from '../AppFrame';
import {useRoute} from '@react-navigation/native';
import {Constants} from './Constants';

export let CommonHeader = function (props) {
    const context = useContext(GlobalContext);
    let style = context.style;
    let route = useRoute();
    return (
        <View style={style.commonScreenHeader}>
            <View style={style.commonScreenHeaderMain}>
                <View style={style.commonScreenHeaderMainContent}>
                    <View style={style.commonScreenHeaderLeft}>
                        <View style={style.commonScreenHeaderTextContainer}>
                            <DefaultText
                                style={style.commonScreenHeaderText}
                            >{Constants.routes[route.name].headerText}</DefaultText>
                        </View>
                    </View>
                    <View style={style.commonScreenHeaderRight}>
                        <TouchableOpacity
                            style={style.headerMenuButton}
                            onPress={props.toggleMenu}
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
