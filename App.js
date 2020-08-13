import { StatusBar } from "expo-status-bar";
import React, { useState, Component } from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import CountdownCircle from "react-native-countdown-circle";
import { Audio } from "expo-av";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default class App extends Component {
  render() {
    const {
      finishedGoal,
      showMain,
      showInt,
      showTimer,
      showBreakTimer,
      stopTime,
    } = this.state;

    if (finishedGoal === false && showBreakTimer === false) {
      return (
        <View style={styles.container}>
          {showTimer && (
            <CountdownCircle
              seconds={2}
              radius={30}
              borderWidth={8}
              color="green"
              bgColor="#fff"
              textStyle={{ fontSize: 20 }}
              onTimeElapsed={this._22Timer}
            />
          )}
          <Text></Text>
          <Text> Main Goal: {this.state.mGoal}</Text>
          <Text> Intermediate Goal: {this.state.iGoal}</Text>
          <Text></Text>
          {showMain && (
            <Main
              onClick={() => this.hideComponent("showMain")}
              mGoal={this.state.mGoal}
              onChangeText={this._mainChange}
            />
          )}
          {showInt && (
            <Intermediate
              onClick={() => this.hideComponent("showInt")}
              iGoal={this.state.iGoal}
              onChangeText={this._intChange}
            />
          )}
          {stopTime && (
            <View>
              <Text>Times up! Click to continue...</Text>
              <Text></Text>
              <Button
                // onPress={this.props.onClick}
                title={"Submit"}
                onPress={this._showQuestion}
              />
            </View>
          )}

          <StatusBar style="auto" />
        </View>
      );
    }

    if (showBreakTimer === true && finishedGoal === false) {
      return (
        <View style={styles.container}>
          <CountdownCircle
            seconds={10}
            radius={30}
            borderWidth={8}
            useNativeDriver={true}
            color="#ff003f"
            bgColor="#fff"
            textStyle={{ fontSize: 20 }}
            onTimeElapsed={this._8Timer}
          />
          <Text></Text>
          <Text> Main Goal: {this.state.mGoal}</Text>
          <Text> Intermediate Goal: {this.state.iGoal}</Text>
          <Text></Text>

          <StatusBar style="auto" />
        </View>
      );
    }
  }

  constructor(props) {
    super(props);
    this.audioPlayer = new Audio.Sound();
    this.state = {
      finishedGoal: false,
      showMain: true,
      showInt: false,
      showTimer: false,
      showBreakTimer: false,
      break: true,

      stopTime: false,

      mGoal: "",
      iGoal: "",
    };

    this._mainChange = this._mainChange.bind(this);
    this._intChange = this._intChange.bind(this);
    this._22Timer = this._22Timer.bind(this);
    this._showQuestion = this._showQuestion.bind(this);
  }

  _mainChange(event) {
    this.setState({ mGoal: event });
  }

  _intChange(event) {
    this.setState({ iGoal: event });
  }

  _showQuestion() {
    this.audioPlayer.unloadAsync();
    this.setState({
      showQA: true,
      showTimer: false,
      showBreakTimer: true,
    });
  }

  playSound = async () => {
    try {
      await this.audioPlayer.loadAsync(require("./alarm.wav"));
      await this.audioPlayer.playAsync();
    } catch (err) {
      console.warn("Couldn't Play audio", err);
    }
  };

  _22Timer() {
    this.playSound();

    this.setState({ showTimer: false, stopTime: true });
  }

  _8Timer = () => {};

  hideComponent(name) {
    switch (name) {
      case "showMain":
        this.setState({ showMain: !this.state.showMain });
        this.setState({ showInt: !this.state.showInt });
        break;
      case "showInt":
        this.setState({ showInt: !this.state.showInt });
        this.setState({ showTimer: !this.state.showTimer });
        break;
      case "showQ&A":
        this.setState({ showTimer: !this.state.showTimer });
        this.setState({ showQA: !this.state.showQA });
        break;
      case "showInt2":
        this.setState({ showInt: !this.state.showInt });
        this.setState({ showQA: !this.state.showQA });
        break;
      case "showTimer":
        this.setState({ showQA: !this.state.showQA });
        this.setState({ showTimer: !this.state.showTimer });
        break;
      default:
        return;
    }
  }
}

class Main extends React.Component {
  render() {
    return (
      <View>
        <Text>Please tell me your Main Goal: </Text>
        <TextInput
          style={{ borderColor: "gray", borderWidth: 1 }}
          type="text"
          placeholder="Type here!"
          value={this.props.mGoal}
          onChangeText={this.props.onChangeText}
        />
        <Button onPress={this.props.onClick} title={"Submit"} />
      </View>
    );
  }
}

class Intermediate extends React.Component {
  render() {
    return (
      <View>
        <Text>Please tell me your Intermediate Goal: </Text>
        <TextInput
          style={{ borderColor: "gray", borderWidth: 1 }}
          type="text"
          placeholder="Type here!"
          value={this.props.iGoal}
          onChangeText={this.props.onChangeText}
        />
        <Button onPress={this.props.onClick} title={"Submit"} />
      </View>
    );
  }
}
