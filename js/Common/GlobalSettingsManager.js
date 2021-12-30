let commonProperties = {
};

let local = {
    environment: 'local',
    apiServerDomain: 'http://localhost:3000',
    fillUsername: 'paul.vincent.warner+m1@gmail.com',
    fillPassword: 'testuser1',
    debugLogger: {
        log: function () {
            console.log.apply(console, arguments);
        },
        storageLog: function () {
            console.log.apply(console, arguments);
        }
    },
};

let production = {
    environment: 'production',
    apiServerDomain: 'http://localhost:3000', // pvw todo
    debugLogger: {
        log: function () {
            // noop
        },
        storageLog: function () {
            // noop
        }
    },
};

Object.assign(local, commonProperties);
Object.assign(production, commonProperties);

export function getGlobalSettings() {
    return local;
}
