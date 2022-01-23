import AsyncStorage from '@react-native-async-storage/async-storage';
import {Constants} from './Constants';

export let Storage = {
    get: function (key) {
        return new Promise(function (resolve, reject) {
            AsyncStorage.getItem(Constants.storagePrefix + key)
                .then(function (data) {
                    if (data) {
                        let returnData = JSON.parse(data);
                        window.setTimeout(function () {
                            resolve(returnData);
                        }, 0);
                    } else {
                        resolve(null);
                    }
                })
                .catch(function (error) {
                    console.log('ERROR during storage get: ', error);
                    reject(error);
                });
        });
    },

    set: function (key, valueJSON) {
        if (valueJSON == null) {
            return this.delete(key);
        } else {
            return AsyncStorage.setItem(Constants.storagePrefix + key, JSON.stringify(valueJSON));
        }
    },

    delete: function (key) {
        return AsyncStorage.removeItem(Constants.storagePrefix + key);
    },
};
