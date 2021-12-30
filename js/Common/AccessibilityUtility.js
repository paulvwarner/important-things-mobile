import {NativeModules, PixelRatio, Platform} from 'react-native';
import {Constants} from './Constants';

export let AccessibilityUtility = {

    getTextMultiplier: function (callback) {
        return new Promise(function (resolve, reject) {
            Promise.resolve()
                .then(function () {
                    return new Promise(function (resolve, reject) {
                        if (Platform.OS === 'ios') {
                            NativeModules.AccessibilityManager.getMultiplier(function (value) {
                                resolve(value);
                            })
                        } else {
                            resolve(PixelRatio.getFontScale());
                        }
                    })
                })
                .then(function (scale) {
                    let textMultiplier = Math.min(Constants.maxTextMultiplier, scale);
                    if (textMultiplier < 1) {
                        textMultiplier = 1;
                    }
                    resolve(textMultiplier);
                })
                .catch(function (error) {
                    console.log('Error getting text multiplier:', error);
                    resolve(1);
                });
        });
    },
};
