import React, {useContext} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {DefaultText} from './DefaultText';
import {SvgXml} from 'react-native-svg';
import hamburgerMenu from '../../images/bars-white.svg';
import {GlobalContext} from '../AppFrame';

export let CommonHeader = function (props) {
    const context = useContext(GlobalContext);
    var style = context.style;

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
