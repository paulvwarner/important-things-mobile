export const Constants = {
    messageTypes: {
        error: 'error',
        success: 'success',
    },

    routes: {
        login: {
            name: 'login',
            screenClassName: 'LoginScreen'
        },
        home: {
            name: 'home',
            screenClassName: 'HomeScreen'
        },
    },

    /* max supported accessibility text size multiplier */
    maxTextMultiplier: 1.786,

    environment: {
        local: 'local',
        production: 'production'
    },

    errorMessages: {
        incorrectCredentialsLogin: 'Incorrect credentials.',
        userDeactivatedLogin: 'User is deactivated.',
        userCannotUseApp: "This user doesn't have the permissions required to this app."
    },

    storagePrefix: '@ITLSData:',
    storage: {
        loginData: 'loginData',
    },
};
