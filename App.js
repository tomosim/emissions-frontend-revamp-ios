import React, { Component } from "react";
import { View, Text, Button } from "react-native";

export default class App extends Component {
  state = { recording: false };
  render() {
    return (
      <View
        style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
      >
        <Text style={{ fontSize: 40, textAlign: "center" }}>Home</Text>
        <Button
          onPress={() => {
            this.setState({ recording: true });
          }}
          title="Record"
          color="#841584"
          accessibilityLabel="Record a journey"
          style={{ alignSelf: "flex-end" }}
        />
      </View>
    );
  }
}
