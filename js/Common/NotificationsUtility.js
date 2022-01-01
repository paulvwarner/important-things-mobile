import messaging from '@react-native-firebase/messaging';
import {Constants} from './Constants';

export let NotificationsUtility = {
    requestUserPermission: async function () {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Authorization status:', authStatus);
        }
    },

    handleForegroundMessages: function () {
        messaging().onMessage(async remoteMessage => {
            console.log('PVW got a foreground FCM message', remoteMessage);
        });
    },

    handleBackgroundMessages: function () {
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('PVW got a background FCM message', remoteMessage);
        });
    },

    subscribeToImportantThings: function () {
        messaging()
            .subscribeToTopic(Constants.importantThingsTopic)
            .then(function () {
                console.log('Device subscribed to important things topic');
            })
            .catch(function (error) {
                console.log('Error subscribing to important things topic:', error);
            });
    },
};
