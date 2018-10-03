import React, { Component } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Navigation } from "react-native-navigation";

export default class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  goToScreen = screenName => {
    console.log(this.props);
    Navigation.push(this.props.componentId, {
      component: {
        name: screenName
      }
    });
  };

  render() {
    return (
      <View style={this.styles.constainer}>
        <Text style={this.styles.text}> Welcome </Text>
        <Button
          title="Go to Record"
          onPress={() => this.goToScreen("Record")}
        />
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
