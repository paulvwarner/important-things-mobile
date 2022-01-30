let commonProperties = {
};

let local = {
    environment: 'local',
    apiServerDomain: 'http://192.168.1.104:3000',
    fillUsername: 'paul.vincent.warner+z1@gmail.com',
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
    apiServerDomain: 'https://pvw-important-things.herokuapp.com/',
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
