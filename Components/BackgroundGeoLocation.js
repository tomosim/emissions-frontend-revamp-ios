import React, { Component } from "react";
import { Button, StyleSheet, View, Text } from "react-native";

import BackgroundGeolocation from "react-native-background-geolocation";

export default class BackgroundGeoLocation extends Component<{}> {
  constructor(props) {
    super(props);

    this.state = {
      enabled: false,
      isMoving: false,
      motionActivity: { activity: "unknown", confidence: 100 },
      odometer: 0,
      // MapView
      markers: [],
      coordinates: [],
      showsUserLocation: false
    };
  }

  componentDidMount() {
    // Step 1:  Listen to events:
    BackgroundGeolocation.on("location", this.onLocation.bind(this));
    BackgroundGeolocation.on("motionchange", this.onMotionChange.bind(this));
    BackgroundGeolocation.on(
      "activitychange",
      this.onActivityChange.bind(this)
    );
    BackgroundGeolocation.on(
      "providerchange",
      this.onProviderChange.bind(this)
    );
    BackgroundGeolocation.on(
      "powersavechange",
      this.onPowerSaveChange.bind(this)
    );

    // Step 2:  #configure:
    BackgroundGeolocation.configure(
      {
        distanceFilter: 10,

        autoSync: true,
        stopOnTerminate: false,
        startOnBoot: true,
        foregroundService: true,
        debug: true,
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE
      },
      state => {
        this.setState({
          enabled: state.enabled,
          isMoving: state.isMoving,
          showsUserLocation: state.enabled
        });
      }
    );
  }

  /**
   * @event location
   */
  onLocation(location) {
    console.log("[event] location: ", location);

    if (!location.sample) {
      this.addMarker(location);
      this.setState({
        odometer: (location.odometer / 1000).toFixed(1)
      });
    }
    this.setCenter(location);
  }
  /**
   * @event motionchange
   */
  onMotionChange(event) {
    console.log("[event] motionchange: ", event.isMovign, event.location);
    this.setState({
      isMoving: event.isMoving
    });
    let location = event.location;
  }
  /**
   * @event activitychange
   */
  onActivityChange(event) {
    console.log("[event] activitychange: ", event);
    this.setState({
      motionActivity: event
    });
  }
  /**
   * @event providerchange
   */
  onProviderChange(event) {
    console.log("[event] providerchange", event);
  }
  /**
   * @event powersavechange
   */
  onPowerSaveChange(isPowerSaveMode) {
    console.log("[event] powersavechange", isPowerSaveMode);
  }

  onToggleEnabled(value) {
    let enabled = !this.state.enabled;

    this.setState({
      enabled: enabled,
      isMoving: false,
      showsUserLocation: false,
      coordinates: [],
      markers: []
    });

    if (enabled) {
      BackgroundGeolocation.start(state => {
        // NOTE:  We tell react-native-maps to show location only AFTER BackgroundGeolocation
        // has requested location authorization.  If react-native-maps requests authorization first,
        // it will request WhenInUse -- "Permissions Tug-of-war"
        this.setState({
          showsUserLocation: true
        });
      });
    } else {
      BackgroundGeolocation.stop();
    }
  }

  onClickGetCurrentPosition() {
    BackgroundGeolocation.getCurrentPosition(
      location => {
        console.log("- getCurrentPosition success: ", location);
      },
      error => {
        console.warn("- getCurrentPosition error: ", error);
      },
      {
        persist: true,
        samples: 1
      }
    );
  }

  onClickChangePace() {
    console.log("- onClickChangePace");
    let isMoving = !this.state.isMoving;
    this.setState({ isMoving: isMoving });
    BackgroundGeolocation.changePace(isMoving);
  }

  addMarker(location) {
    let marker = {
      key: location.uuid,
      title: location.timestamp,
      heading: location.coords.heading,
      coordinate: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }
    };

    this.setState({
      markers: [...this.state.markers, marker],
      coordinates: [
        ...this.state.coordinates,
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }
      ]
    });
  }

  setCenter(location) {
    if (!this.refs.map) {
      return;
    }

    this.refs.map.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    });
  }

  renderMarkers() {
    let rs = [];
    this.state.markers.map(marker => {
      rs.push(
        <MapView.Marker
          key={marker.key}
          coordinate={marker.coordinate}
          anchor={{ x: 0, y: 0.1 }}
          title={marker.title}
        >
          <View style={[styles.markerIcon]} />
        </MapView.Marker>
      );
    });
    return rs;
  }

  render() {
    return (
      <View>
        <Button onPress={() => this.onToggleEnabled()} title={"record"} />
        <Text>{JSON.stringify(this.state.enabled)}</Text>
        <Text>{JSON.stringify(this.state.coordinates)}</Text>
      </View>
    );
  }

  /**
   * Dispatch back to HomeScreen Application-switcher
   */
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: "#272727"
  },
  header: {
    backgroundColor: "#fedd1e"
  },
  title: {
    color: "#000"
  },
  footer: {
    backgroundColor: "#fedd1e",
    paddingLeft: 10,
    paddingRight: 10
  },
  footerBody: {
    justifyContent: "center",
    width: 200,
    flex: 1
  },
  icon: {
    color: "#fff"
  },
  map: {
    flex: 1
  },
  status: {
    fontSize: 12
  },
  markerIcon: {
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "rgba(0,179,253, 0.6)",
    width: 10,
    height: 10,
    borderRadius: 5
  }
});
