import {Constants} from './Constants';
import {Storage} from './Storage';

export var AuthUtility = {
    logout: function (navigationUtility) {
        Storage.delete(Constants.storage.loginData)
            .then(function () {
                AuthUtility.routeToLogin(navigationUtility);
            })
            .catch(function (error) {
                AuthUtility.routeToLogin(navigationUtility);
            });
    },

    routeToLogin: function (navigationUtility) {
        navigationUtility.navigateTo(Constants.routes.login.name, {lastLogoutTime: (new Date()).getTime()});
    },
};
