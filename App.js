import React, { Component } from "react";
import { Platform, Text, View, StyleSheet } from "react-native";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

export default class App extends Component {
  state = {
    location: null,
    errorMessage: null
  };

  componentWillMount() {
    console.disableYellowBox = true;
    if (Platform.OS === "android" && !Constants.isDevice) {
      this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }

    // let location = await Location.getCurrentPositionAsync({});
    // this.setState({ location });

    let newLocation = await Location.startLocationUpdatesAsync("gps", {
      accuracy: Location.Accuracy.Balanced
    });
    this.setState({ location: newLocation });
  };

  render() {
    let text = "Aguardando..here";
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }

    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>{text}</Text>
      </View>
    );
  }
}
let counter = 0;
TaskManager.defineTask("gps", ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    if (counter <= 5) {
      console.log(counter);
      const { locations } = data;
      console.log(locations);
      counter++;
    } else {
      console.log("finished?");
      Location.stopLocationUpdatesAsync("gps");
      console.log(Location.stopLocationUpdatesAsync("gps"));
    }

    // this.setState({ location: locations });
    // do something with the locations captured in the background
  }
});

// TaskManager.defineTask("gps", () => {
//   try {
//     const receivedNewData = () => {
//       return "great";
//     };
//     return receivedNewData
//       ? BackgroundFetch.Result.NewData
//       : BackgroundFetch.Result.NoData;
//   } catch (error) {
//     return BackgroundFetch.Result.Failed;
//   }
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1"
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: "center"
  }
});
