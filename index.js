// /** @format */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);

import { Navigation } from "react-native-navigation";
import Welcome from "./screens/Welcome";
import Record from "./screens/Record";

Navigation.registerComponent("Welcome", () => Welcome);
Navigation.registerComponent("Record", () => Record);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        id: "AppStack",
        children: [
          {
            component: {
              name: "Welcome"
            }
          }
        ]
      }
    }
  });
});
