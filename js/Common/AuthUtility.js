import {Constants} from './Constants';
import {Storage} from './Storage';
import {NotificationsUtility} from './NotificationsUtility';

export let AuthUtility = {
    logout: function (navigationUtility) {
        NotificationsUtility.unsubscribeFromImportantThings();
        Storage.delete(Constants.storage.loginData)
            .then(function () {
                window.setTimeout(function () {
                    AuthUtility.routeToLogin(navigationUtility);
                }, 0);
            })
            .catch(function (error) {
                window.setTimeout(function () {
                    AuthUtility.routeToLogin(navigationUtility);
                }, 0);
            });
    },

    routeToLogin: function (navigationUtility) {
        navigationUtility.navigateTo(Constants.routes.login.name, {lastLogoutTime: (new Date()).getTime()});
    },
};
