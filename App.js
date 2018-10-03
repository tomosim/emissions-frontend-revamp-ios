import React, { Component } from "react";
import { View, Text, Button } from "react-native";
import BackgroundGeolocation from "./Components/BackgroundGeoLocation";

export default class App extends Component {
  state = { recording: false };
  render() {
    return (
      <View
        style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
      >
        <Text style={{ fontSize: 40, textAlign: "center" }}>Home</Text>
        <BackgroundGeolocation recording={this.state.recording} />
      </View>
    );
  }
}
