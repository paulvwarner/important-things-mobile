'use strict';
import {Dimensions, Platform} from 'react-native';
import {Constants} from '../Common/Constants';

let ReactNative = require('react-native');

// iOS font names
// Oxygen-Sans-Book
// Oxygen-Sans-Book-Oblique
// Oxygen-Sans-Bold
// Oxygen-Sans-Bold-Oblique

let primaryFontFamilyIOS = 'Oxygen-Sans-Book';
let boldFontFamilyIOS = 'Oxygen-Sans-Bold';
let italicFontFamilyIOS = 'Oxygen-Sans-Book-Oblique';

// pvw todo android font names
let primaryFontFamilyAndroid = 'barlow_regular';
let boldFontFamilyAndroid = 'barlow_bold';
let italicFontFamilyAndroid = 'barlow_italic';


let minimumIosStatusBarHeight = 20;


// colors
export let colors = {
    white: '#ffffff',
    black: '#000000',
    red: '#bb342d',
    lighterRed: '#e13f36',
    green: 'green',
    transparent: 'transparent',
    borderGray: '#bdbdbd',
};

export function constructDimensions(textMultiplier) {
    let loginPageTextInputHorizontalMargin = 30;

    var commonScreenHeaderContentHorizontalPadding = 20;
    var commonScreenHeaderContentWidth = Dimensions.get('window').width - (commonScreenHeaderContentHorizontalPadding * 2);

    return {
        defaultBottomScreenPadding: 60,
        gestureBarPaddingIOS: 35,
        nonNotchedPhoneStatusBarThreshold: 24,
        loginPageTextInputHorizontalMargin: loginPageTextInputHorizontalMargin,
        loginPageTextInputWidth: Dimensions.get('window').width - (loginPageTextInputHorizontalMargin * 2),

        commonScreenHeaderHeight: 65,
        commonScreenHeaderContentHorizontalPadding: commonScreenHeaderContentHorizontalPadding,
        commonScreenHeaderContentWidth: commonScreenHeaderContentWidth,
        commonScreenHeaderMainContentHeight: styleFunctions.getMultiplierDependentValue(textMultiplier, 50),

        mainMenuPaneWidth: Dimensions.get('window').width * 4 / 5,
        mainMenuOptionContainerRowHorizontalPadding: 20,
        mainMenuOptionTextVerticalPadding: 10,
    };
}

function androidOnly(style) {
    return Platform.select({
        ios: {},
        android: style,
    });
}

function iosOnly(style) {
    return Platform.select({
        ios: style,
        android: {},
    });
}

function tallText() {
    return {transform: [{scaleY: 1.5}]};
}

function italic() {
    return Platform.select({
        ios: {
            fontFamily: italicFontFamilyIOS,
        },
        android: {
            fontFamily: italicFontFamilyAndroid,
        },
    });
}

function bold() {
    return Platform.select({
        ios: {
            fontFamily: boldFontFamilyIOS,
        },
        android: {
            fontFamily: boldFontFamilyAndroid,
        },
    });
}

function regularFontFamily() {
    return Platform.select({
        ios: {
            fontFamily: primaryFontFamilyIOS,
        },
        android: {
            fontFamily: primaryFontFamilyAndroid,
        },
    });
}

function boxShadow() {
    return Platform.select({
        ios: {
            shadowColor: '#000000',
            shadowOffset: {width: 0, height: 3},
            shadowOpacity: 0.2,
            shadowRadius: 4,
        },
        android: {
            elevation: 3,
        },
    });
}

export let styleFunctions = {
    getMinimumStatusBarHeight: function () {
        return Platform.OS === 'ios' ? minimumIosStatusBarHeight : 0;
    },

    getMultiplierDependentValue: function (textMultiplier, value, furtherMultiplier) {
        let furtherMultiplierToUse = (furtherMultiplier || 1);
        if (textMultiplier === 1) {
            furtherMultiplierToUse = 1;
        }
        return textMultiplier * value * furtherMultiplierToUse;
    },

    getMultiplierBoundedValue: function (textMultiplier, value, bound, furtherMultiplier) {
        let furtherMultiplierToUse = (furtherMultiplier || 1);
        if (textMultiplier === 1) {
            furtherMultiplierToUse = 1;
        }
        return Math.min(bound, value * textMultiplier * furtherMultiplierToUse);
    },

    fontSize: function (textMultiplier, size, max) {
        if (Platform.OS === 'ios') {
            return {
                fontSize: styleFunctions.getMultiplierBoundedValue(
                    textMultiplier,
                    size * textMultiplier,
                    max || (size * Constants.maxTextMultiplier),
                ),
            };
        } else {
            let androidFixedSize = size;
            let androidFixedMax = max;
            return {
                fontSize: styleFunctions.getMultiplierBoundedValue(
                    textMultiplier,
                    androidFixedSize * textMultiplier,
                    androidFixedMax || (androidFixedSize * Constants.maxTextMultiplier)),
            };
        }
    },
};


export function constructStyle(textMultiplier, dimensions) {
    function getMultiplierDependentValue(value, furtherMultiplier) {
        return styleFunctions.getMultiplierDependentValue(textMultiplier, value, furtherMultiplier);
    }

    function fontSize(size, max) {
        return styleFunctions.fontSize(textMultiplier, size, max);
    }

    return ReactNative.StyleSheet.create({
        container: {
            position: 'relative',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            width: Dimensions.get('window').width,
        },
        safeAreaViewWrapper: {
            flexDirection: 'column',
            flex: 1,
        },
        errorPage: {
            flexDirection: 'column',
            flex: 1,

            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
        },
        errorPageContentContainer: {
            padding: 40,
            width: Dimensions.get('window').width,
            flexDirection: 'column',
            flex: 0,
            justifyContent: 'flex-start',
            alignItems: 'center',
        },
        errorPageScrollContent: {
            flexDirection: 'column',
            flex: 1,
        },
        errorPageText: {
            flexDirection: 'column',
        },

        loginWindow: {
            flexDirection: 'column',
            flex: 1,
            zIndex: 222,
        },
        landingPageScroller: {
            flexDirection: 'column',
            flex: 1,
            width: Dimensions.get('window').width,
            position: 'relative',
            zIndex: 2,
        },
        loginPageStyle: {
            flexDirection: 'column',
            flex: 1,
            backgroundColor: colors.white,
            height: Dimensions.get('window').height,
            width: Dimensions.get('window').width,
            justifyContent: 'center',
            alignItems: 'center',
        },

        loginPageMovingContent: {
            justifyContent: 'center',
            alignItems: 'center',
            width: Dimensions.get('window').width,
            flexDirection: 'column',
        },
        loginPageFormContent: {
            paddingBottom: 100,
        },
        loginScreenContent: {
            width: Dimensions.get('window').width,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            flex: 1,
            position: 'relative',
            paddingTop: 40,
        },
        loginScreenLogo: {
            width: Dimensions.get('window').width - 160,
            height: Dimensions.get('window').width - 160,
            maxWidth: 200,
            maxHeight: 200,
            marginBottom: 20,
        },
        loginScreenLabel: {
            textAlign: 'center',
            ...tallText(),
            ...bold(),
            ...fontSize(26, 30),
            marginBottom: 30,
        },
        loginPageUsername: {
            marginTop: 10,
            marginBottom: 5,
        },
        loginPagePassword: {
            marginBottom: 10,
        },
        loginPageTextInput: {
            width: dimensions.loginPageTextInputWidth,
            height: styleFunctions.getMultiplierDependentValue(textMultiplier, 50),
            marginLeft: dimensions.loginPageTextInputHorizontalMargin,
            marginRight: dimensions.loginPageTextInputHorizontalMargin,
            marginTop: 20,
            backgroundColor: colors.white,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.black,
            paddingLeft: 10,
            paddingRight: 10,
            color: colors.black,
            ...fontSize(14, 18),
        },

        defaultText: {
            ...regularFontFamily(),
            color: colors.black,
        },
        defaultTextInput: {
            ...regularFontFamily(),
            color: colors.black,
        },

        fullWindow: {
            height: Dimensions.get('window').height,
            width: Dimensions.get('window').width,
        },
        screenFrame: {
            flexDirection: 'column',
            flex: 1,
            width: Dimensions.get('window').width,
            justifyContent: 'flex-start',
            backgroundColor: colors.white,
            zIndex: 1,
            position: 'relative',
        },

        screenScrollView: {
            flex: 1,
            flexDirection: 'column',
            height: Dimensions.get('window').height,
            position: 'relative',
            top: 0,
            left: 0,
            zIndex: 1,
        },
        negativeFrameOver: {
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'flex-start',
            backgroundColor: 'transparent',
            zIndex: 200,
            position: 'relative',
        },
        whiteOverlay: {
            backgroundColor: colors.white,
            height: Dimensions.get('window').height,
            width: Dimensions.get('window').width,
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 8,
        },

        columnView: {
            position: 'relative',
            flexDirection: 'column',
            flex: 1,
        },
        loginScreenContainer: {
            backgroundColor: colors.white,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
        },
        frameViewStyle: {
            width: Dimensions.get('window').width,
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'flex-start',
            backgroundColor: 'transparent',
            zIndex: 1,
            position: 'relative',
        },

        loadingIndicatorOverlay: {
            flex: 1,
            flexDirection: 'column',
            position: 'absolute',
            top: 0,
            left: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            height: Dimensions.get('window').height,
            width: Dimensions.get('window').width,
            zIndex: 9999,
        },


        loadingIndicator: {
            backgroundColor: 'transparent',
            padding: 15,
            borderRadius: 10,
            position:'relative'
        },

        loadingIndicatorImage: {
            width: 100,
            height: 100,
            resizeMode: 'contain',
            flexDirection: 'column',
        },
        messageDisplayingComponentContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            backgroundColor: '#f0f0f0',
            height: Dimensions.get('window').height,
            width: Dimensions.get('window').width,
            position: 'relative',
            zIndex: 9998,
        },
        messageContainerOverlayStyle: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 9998,
            backgroundColor: 'transparent',
        },
        messageContainerStyle: {
            flex: 1,
            alignItems: 'flex-end',
            justifyContent: 'center',
            flexDirection: 'row',
            width: Dimensions.get('window').width - 40,
            position: 'absolute',
            bottom: 40,
            left: 0,
            marginLeft: 20,
            marginRight: 20,
            zIndex: 99,
        },
        messageRowStyle: {
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        messageColumnStyle: {
            flexDirection: 'column',
            flex: 1,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 10,
            paddingRight: 10,
        },
        messageTextStyle: {
            color: colors.white,
            ...fontSize(14, 18),
            alignSelf: 'center',
            ...bold(),
            textAlign: 'center',
            ...androidOnly({
                paddingBottom: 4,
            }),
        },
        messageModalUnderlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 3,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            backgroundColor: 'rgba(0,0,0,0.3)',
        },
        messageModalUnderlayTransparent: {
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 3,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            backgroundColor: colors.transparent,
        },

        statusBarOuterContainer: {
            position: 'relative',
            overflow: 'visible',
            flexDirection: 'column',
        },

        pillButtonContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
        },
        pillButton: {
            borderRadius: 25,
            height: 50,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: 20,
            paddingRight: 20,
            backgroundColor: colors.black,
        },
        pillButtonText: {
            color: colors.white,
        },
        loginButtonContainer: {
            marginTop: 10,
        },
        loginButton: {},
        loginButtonText: {
            ...bold(),
            ...tallText(),
        },

        commonScreenContainer: {
            position: 'relative',
            flexDirection: 'column',
            flex: 1,
            width: Dimensions.get('window').width,
            zIndex: 200,
        },
        commonScreenHeader: {
            width: Dimensions.get('window').width,
            flexDirection: 'column',
            backgroundColor: colors.black,
            position: 'relative',
            zIndex: 9999,
        },
        commonScreenHeaderMain: {
            flexDirection: 'column',
            position: 'relative',
            height: dimensions.commonScreenHeaderHeight,
            justifyContent: 'flex-start',
        },

        commonScreenHeaderMainContent: {
            flexDirection: 'row',
            flex: 1,
            height: dimensions.commonScreenHeaderMainContentHeight,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
        },
        commonScreenHeaderLeft: {
            paddingLeft: dimensions.commonScreenHeaderContentHorizontalPadding,
            paddingRight: dimensions.commonScreenHeaderContentHorizontalPadding,
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            position: 'relative',
            height: dimensions.commonScreenHeaderMainContentHeight,
        },
        commonScreenHeaderRight: {
            flexDirection: 'row',
            width: 50,
            paddingRight: dimensions.commonScreenHeaderContentHorizontalPadding,
            justifyContent: 'flex-end',
            alignItems: 'center',
            position: 'relative',
            height: dimensions.commonScreenHeaderMainContentHeight,
        },
        commonScreenHeaderTextContainer: {
            flexDirection: 'row',
            flex: 1,
            paddingLeft: 8,
            paddingRight: 8,
            paddingTop: 4,
            paddingBottom: 4,
        },
        commonScreenHeaderText: {
            ...fontSize(20, 24),
            ...bold(),
            ...tallText(),
            textAlign: 'left',
            color: colors.white,
            letterSpacing: 0,
        },
        headerMenuButton: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        headerMenuImageContainer: {
            width: 30,
            height: 30,
        },
        commonListContainer: {
            flexDirection: 'column',
            flex: 1,
            width: Dimensions.get('window').width,
            position: 'relative',
            zIndex: 100,
        },

        mainMenuPaneContainer: {
            width: Dimensions.get('window').width,
            flexDirection: 'column',
            flex: 1,
            position: 'absolute',
            top: 0,
            zIndex: 999,
        },
        mainMenuPane: {
            position: 'absolute',
            marginTop: dimensions.commonScreenHeaderHeight,
            width: dimensions.mainMenuPaneWidth,
            flexDirection: 'column',
            flex: 1,
            top: 0,
            ...boxShadow(),
        },
        mainMenuOptionsContainer: {
            flexDirection: 'column',
            width: dimensions.mainMenuPaneWidth,
            flex: 1,
        },
        mainMenuPaneContent: {
            flexDirection: 'column',
            width: dimensions.mainMenuPaneWidth,
            backgroundColor: colors.white,
            flex: 1,
        },
        mainMenuBottomContent: {
            flexDirection: 'column',
            width: dimensions.mainMenuPaneWidth,
            height: 100,
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
            paddingLeft: 20,
            marginBottom: dimensions.gestureBarPaddingIOS,
        },
        mainMenuLogo: {
            width: 100,
            height: 100,
            resizeMode: 'contain',
            marginBottom: 30,
            flexDirection: 'column',
        },
        mainMenuAppVersionText: {
            ...fontSize(18, 24),
            textAlign: 'center',
            flexDirection: 'column',
        },
        mainMenuContainer: {
            flexDirection: 'column',
        },
        mainMenuOptionContainer: {
            flexDirection: 'column',
            width: dimensions.mainMenuPaneWidth,
            paddingLeft: dimensions.mainMenuOptionContainerRowHorizontalPadding,
            paddingRight: dimensions.mainMenuOptionContainerRowHorizontalPadding,
        },
        mainMenuOptionContainerRowFull: {
            width: dimensions.mainMenuPaneWidth,
            paddingLeft: dimensions.mainMenuOptionContainerRowHorizontalPadding,
            paddingRight: dimensions.mainMenuOptionContainerRowHorizontalPadding,
        },
        mainMenuOptionOuterContainer: {
            flexDirection: 'column',
            borderBottomColor: colors.black,
            borderBottomWidth: 1,
        },
        mainMenuOptionContent: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'transparent',
            minHeight: 40,
        },
        mainMenuOptionLabelText: {
            flexDirection: 'row',
            ...fontSize(20),
            ...bold(),
            ...tallText(),
            color: colors.black,
            paddingTop: dimensions.mainMenuOptionTextVerticalPadding,
            paddingBottom: dimensions.mainMenuOptionTextVerticalPadding,
        },

        commonFlatList: {
            flexDirection: 'column',
            flex: 1,
            width: Dimensions.get('window').width,
        },

        commonFlatListScrollContent: {
            flexDirection: 'column',
            width: Dimensions.get('window').width,
            paddingTop: 20,
            paddingBottom: 80,
        },

        commonListItem: {
            flexDirection: 'column',
            flex: 1,
            ...boxShadow(),
            backgroundColor: colors.white,
            marginLeft: 20,
            marginRight: 20,
            marginBottom: 20,
            padding: 20,
            borderRadius: 20,
        },

        commonListItemHeaderText: {
            flexDirection: 'column',
            ...fontSize(24, 30),
            ...bold()
        },
        commonListItemDivider: {
            height: 1,
            backgroundColor: colors.borderGray,
            marginTop: 10,
            marginBottom: 10,
        },
        commonListItemBodyText: {
            flexDirection: 'column',
            ...fontSize(18, 24),
        },
    });
}
