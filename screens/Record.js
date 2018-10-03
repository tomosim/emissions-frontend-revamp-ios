import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import BackgroundGeoLocation from "../Components/BackgroundGeoLocation";

export default class Record extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={this.styles.constainer}>
        <BackgroundGeoLocation />
      </View>
    );
  }

  styles = StyleSheet.create({
    text: {
      fontSize: 24
    },
    constainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }
  });
}
