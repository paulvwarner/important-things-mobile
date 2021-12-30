import {AppRegistry} from 'react-native';
import {AppFrame} from './js/AppFrame';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => AppFrame);
