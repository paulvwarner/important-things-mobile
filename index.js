import {AppRegistry} from 'react-native';
import {AppFrame} from './js/AppFrame';
import {name as appName} from './app.json';
import {NotificationsUtility} from './js/Common/NotificationsUtility';

NotificationsUtility.handleBackgroundMessages();

AppRegistry.registerComponent(appName, () => AppFrame);

function HeadlessCheck({isHeadless}) {
    if (isHeadless) {
        // App has been launched in the background by iOS, ignore
        return null;
    } else {
        return AppFrame;
    }
}

AppRegistry.registerComponent('app', () => HeadlessCheck);
