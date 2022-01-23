import {Constants} from '../Common/Constants';
import {Storage} from '../Common/Storage';
import {AuthUtility} from '../Common/AuthUtility';

var _ = require('underscore');
var Logger = null;

export var ApiUtility = (function () {
    function ApiUtility() {
    }

    ApiUtility.prototype.setGlobalSettings = function (globalSettings) {
        this.globalSettings = globalSettings;
        Logger = this.globalSettings.debugLogger;
    };

    ApiUtility.prototype.setToken = function (token) {
        this.token = token;
    };

    ApiUtility.prototype.setLoginData = function (loginData) {
        this.loginData = loginData;
    };

    ApiUtility.prototype.setNavigationUtility = function (navigationUtility) {
        this.navigationUtility = navigationUtility;
    };

    ApiUtility.prototype.apiRequest = function (url, options, asText) {
        var self = this;
        var extendedHeaders = (options && options.headers) || {};

        extendedHeaders['wwwauthenticate'] = '' + this.token;

        return new Promise(function (resolve, reject) {
            fetch(
                self.globalSettings.apiServerDomain + url,
                _.extend(options || {}, {headers: extendedHeaders}),
            )
                .then(function (rawResponse) {
                    if (rawResponse.status === 401) {
                        console && console.log('Unauthorized - sending back to login screen: ', rawResponse);

                        if (self.navigationUtility) {
                            AuthUtility.logout(self.navigationUtility);
                        }

                        throw new Error((rawResponse.statusText));
                    } else if (rawResponse.status === 404) {
                        console && console.log('A ' + rawResponse.status + ' occurred during an API call: ', rawResponse);
                        throw new Error((rawResponse.statusText));
                    } else if (rawResponse.status === 500) {
                        console && console.log('A ' + rawResponse.status + ' occurred during an API call: ', rawResponse);
                        console && console.log('An error occurred during an API call: ', arguments);
                        throw new Error((rawResponse.statusText));
                    } else {
                        if (asText) {
                            return rawResponse.text();
                        } else {
                            return rawResponse.json();
                        }
                    }
                })
                .then(function (responseData) {
                    if (responseData === 'null') {
                        resolve(null);
                    } else {
                        resolve(responseData);
                    }
                })
                .catch(function (error) {
                    console && console.log('An error occurred during an API call: ', arguments);
                    reject((error));
                });
        });
    };

    /************************************************************************************
     *
     * API auth methods
     *
     ************************************************************************************/

    ApiUtility.prototype.login = function (username, password) {
        var loginUrl = this.globalSettings.apiServerDomain + '/api/users/login';
        var loginData;

        return fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
            .then(function (rawResponse) {
                return rawResponse.json();
            })
            .then(function (jsonResponse) {
                loginData = jsonResponse;

                if (!loginData.user || !loginData.user.authentication_token) {
                    // login failed
                    return Promise.resolve({});
                } else {
                    return Storage.set(Constants.storage.loginData, loginData);
                }
            })
            .then(function () {
                return Promise.resolve(loginData);
            });
    };

    ApiUtility.prototype.logout = function () {
        var self = this;
        self.setLoginData(null);

        // delete local storage of loginData to prevent auto re-login
        return Storage.delete(Constants.storage.loginData)
            .then(function () {
                return self.apiRequest(
                    '/api/users/' + encodeURIComponent(self.token) + '/logout',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                );
            });
    };

    /************************************************************************************
     *
     * API CRUD methods
     *
     ************************************************************************************/

    ApiUtility.prototype.getImportantThingsList = function () {
        return this.apiRequest('/api/important-things/for-app');
    };

    return ApiUtility;
}());

