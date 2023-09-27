export const Constants = {
    messageTypes: {
        error: 'error',
        success: 'success',
    },

    routes: {
        login: {
            name: 'login',
            screenClassName: 'LoginScreen',
        },
        insights: {
            name: 'insights',
            screenClassName: 'InsightsListScreen',
            headerText: 'INSIGHTS',
        },
        selfCareTools: {
            name: 'selfCareTools',
            screenClassName: 'SelfCareToolsListScreen',
            headerText: 'SELF-CARE TOOLS',
        },
        affirmations: {
            name: 'affirmations',
            screenClassName: 'AffirmationsListScreen',
            headerText: 'AFFIRMATIONS',
        },
        logout: {
            name: 'logout',
        },
    },

    importantThingsTopic: 'importantthings',

    messageDisplayDurationMs: 3000,

    /* max supported accessibility text size multiplier */
    maxTextMultiplier: 1.786,

    environment: {
        local: 'local',
        production: 'production',
    },

    errorMessages: {
        incorrectCredentialsLogin: 'Incorrect credentials.',
        userDeactivatedLogin: 'User is deactivated.',
        userCannotUseApp: 'This user doesn\'t have the permissions required to this app.',
    },

    storagePrefix: '@ITLSData:',
    storage: {
        loginData: 'loginData',
    },
};
