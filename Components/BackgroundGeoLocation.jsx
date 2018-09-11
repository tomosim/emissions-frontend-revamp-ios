import BackgroundGeolocation from "react-native-background-geolocation";
import React, { Component } from "react";
import { View, Text } from "react-native";

export default class BackgroundGeoLocation extends Component {
  state = { coords: { lat: 0, long: 0 } };
  componentWillMount() {
    ////
    // 1.  Wire up event-listeners
    //

    // This handler fires whenever bgGeo receives a location update.
    BackgroundGeolocation.on("location", this.onLocation, this.onError);

    // This handler fires when movement states changes (stationary->moving; moving->stationary)
    BackgroundGeolocation.on("motionchange", this.onMotionChange);

    // This event fires when a change in motion activity is detected
    BackgroundGeolocation.on("activitychange", this.onActivityChange);

    // This event fires when the user toggles location-services authorization
    BackgroundGeolocation.on("providerchange", this.onProviderChange);

    ////
    // 2.  Execute #ready method (required)
    //
    BackgroundGeolocation.ready(
      {
        // Geolocation Config
        desiredAccuracy: 0,
        distanceFilter: 10,
        // Activity Recognition
        stopTimeout: 1,
        // Application config
        debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
        stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
        startOnBoot: true, // <-- Auto start tracking when device is powered-up.
        // HTTP / SQLite config
        url: "http://yourserver.com/locations",
        batchSync: false, // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
        autoSync: true, // <-- [Default: true] Set true to sync each location to server as it arrives.
        headers: {
          // <-- Optional HTTP headers
          "X-FOO": "bar"
        },
        params: {
          // <-- Optional HTTP params
          auth_token: "maybe_your_server_authenticates_via_token_YES?"
        }
      },
      state => {
        console.log(
          "- BackgroundGeolocation is configured and ready: ",
          state.enabled
        );

        if (!state.enabled) {
          ////
          // 3. Start tracking!
          //
          BackgroundGeolocation.start(function() {
            console.log("- Start success");
          });
        }
      }
    );
  }

  // You must remove listeners when your component unmounts
  componentWillUnmount() {
    BackgroundGeolocation.removeListeners();
  }
  onLocation = location => {
    console.log(location.coords);

    this.setState({
      coords: { lat: location.coords.latitude, long: location.coords.longitude }
    });
  };
  onError(error) {
    console.warn("- [event] location error ", error);
  }
  onActivityChange(activity) {
    console.log("- [event] activitychange: ", activity); // eg: 'on_foot', 'still', 'in_vehicle'
  }
  onProviderChange(provider) {
    console.log("- [event] providerchange: ", provider);
  }
  onMotionChange(location) {
    console.log("- [event] motionchange: ", location.isMoving, location);
  }

  render() {
    return (
      <View
        style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
      >
        <Text style={{ fontSize: 40, textAlign: "center" }}>location:</Text>
        <Text style={{ fontSize: 20, textAlign: "center" }}>
          {`${this.state.coords.long}, ${this.state.coords.lat}`}
        </Text>
      </View>
    );
  }
}
