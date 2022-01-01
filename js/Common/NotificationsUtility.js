import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
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
            const channelId = await notifee.createChannel({
                id: 'default',
                name: 'Default Channel',
            });

            await notifee.displayNotification({
                body: remoteMessage.notification.body,
                android: {
                    channelId,
                    smallIcon: 'ic_stat_name',
                },
            });
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

    unsubscribeFromImportantThings: function () {
        messaging()
            .unsubscribeFromTopic(Constants.importantThingsTopic)
            .then(function () {
                console.log('Device unsubscribed from important things topic');
            })
            .catch(function (error) {
                console.log('Error unsubscribing from important things topic:', error);
            });
    },
};
