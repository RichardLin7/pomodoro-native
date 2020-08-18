// create array list that extends index by 1 and stores the sub-objective
// when completed, it removes the last index

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
      stopBreak,
    } = this.state;

    if (finishedGoal === false && showBreakTimer === false) {
      return (
        <View style={styles.container}>
          {showTimer && (
            <CountdownCircle
              seconds={3}
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

          {this.state.child.map((child, i) => {
            return <Text> Sub-Intermediate Goal: {this.state.child[i]}</Text>;
          })}

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
              <Button title={"Submit"} onPress={this._showQuestion} />
            </View>
          )}
          <StatusBar style="auto" />
        </View>
      );
    }

    if (showBreakTimer === true && finishedGoal === false) {
      return (
        <View style={styles.container}>
          {stopBreak === false && (
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

              {this.state.child.map((child, i) => {
                return <SubIntermediate key={i} child={child} />;
              })}

              <Text></Text>
              <Question
                showInt={() => this.hideComponent("showInt2")}
                showTimer={() => this.hideComponent("showTimer")}
                isFinished={this._isFinished}
                breakOver={this._breakOver}
                onClick={() => this.hideComponent("showInt")}
                iGoal={this.state.iGoal}
                sGoal={this.state.sGoal}
                onChange={this._intChange}
                _subGoal={() => this._subGoal(i)}
                subText={this._subChange}
              />
              <StatusBar style="auto" />
            </View>
          )}

          {stopBreak && (
            <View>
              <Text>Times Up! Click to Continue...</Text>
              <Button onPress={this._breakOver} title={"Continue"} />
              <StatusBar style="auto" />
            </View>
          )}
          <StatusBar style="auto" />
        </View>
      );
    }

    if (finishedGoal === true) {
      return (
        <View style={styles.container}>
          <Text>Good Job! Enjoy the rest of your day!</Text>
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
      stopBreak: false,

      index: 0,
      child: [],

      mGoal: "",
      iGoal: "",
      sGoal: "",
    };

    this._isFinished = this._isFinished.bind(this);
    this._showQuestion = this._showQuestion.bind(this);
    this._mainChange = this._mainChange.bind(this);
    this._intChange = this._intChange.bind(this);
    this._subChange = this._subChange.bind(this);
    this._breakOver = this._breakOver.bind(this);
    this._22Timer = this._22Timer.bind(this);
    this._8Timer = this._8Timer.bind(this);
    this._subGoal = this._subGoal.bind(this);
  }

  _mainChange(event) {
    this.setState({ mGoal: event });
  }

  _intChange(event) {
    this.setState({ iGoal: event });
  }

  _subChange(event) {
    this.setState({ sGoal: event });
  }

  _showQuestion() {
    this.audioPlayer.unloadAsync();
    this.setState({
      showTimer: false,
      showBreakTimer: true,
      stopTime: false,
    });
  }

  _breakOver() {
    this.audioPlayer.unloadAsync();
    this.setState({
      showBreakTimer: false,
      showTimer: true,
      stopBreak: false,
    });
  }

  _subGoal(e) {
    // e.stopPropagation();
    this.setState({
      child: this.state.child.concat("Bobby"),
      index: this.state.index + 1,
    });
    console.log("sub goal made");
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

  _8Timer() {
    this.playSound();
    this.setState({ stopBreak: true });
  }

  _isFinished() {
    this.setState({ finishedGoal: true });
  }
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

        break;
      case "showInt2":
        this.setState({ showInt: !this.state.showInt });

        break;
      case "showTimer":
        this.setState({ showTimer: !this.state.showTimer });
        break;
      default:
        return;
    }
  }
}

class Question extends React.Component {
  render() {
    const {
      showQuestion,
      showMet,
      showDone,
      newGoal,
      breakTime,
      childGoal,
      subGoal,
    } = this.state;

    if (showQuestion) {
      return (
        <View>
          <Text></Text>
          <Text>Was Intermediate Goal relevant?</Text>
          <Text></Text>
          <Button onPress={() => this.hideComponent("rGoal")} title={"Yes"} />
          <Button onPress={() => this.hideComponent("newGoal")} title={"No"} />
        </View>
      );
    }

    if (showMet) {
      return (
        <View>
          <Text></Text>
          <Text>Has Intermediate Goal been met?</Text>
          <Text></Text>
          <Button onPress={() => this.hideComponent("met")} title={"Yes"} />
          <Button
            onPress={() => this.hideComponent("childGoal")}
            title={"No"}
          />
        </View>
      );
    }

    if (childGoal) {
      return (
        <View>
          <Text></Text>
          <Text>
            Would you like to set an Intermediate Goal for this Intermediate
            Goal?
          </Text>
          <Text></Text>
          <Button onPress={() => this.hideComponent("subGoal")} title={"Yes"} />
          <Button onPress={() => this.hideComponent("break")} title={"No"} />
        </View>
      );
    }

    if (subGoal) {
      return (
        <View>
          <Text>Please tell me your Sub-Intermediate Goal: </Text>
          <TextInput
            style={{ borderColor: "gray", borderWidth: 1 }}
            type="text"
            placeholder="Type here!"
            value={this.props.sGoal}
            onChangeText={this.props.subText}
          />
          <Button
            onPress={(this.props._subGoal, () => this.hideComponent("break"))}
            title={"Submit"}
          />
        </View>
      );
    }

    if (showDone) {
      return (
        <View>
          <Text></Text>
          <Text>
            Would you like to set a new Intermediate Goal or are you done with
            the Main Goal?
          </Text>
          <Text></Text>
          <Button
            onPress={() => this.hideComponent("newGoal")}
            title={"New Intermediate Goal"}
          />
          <Button
            onPress={this.props.isFinished}
            title={"Done with Main Goal."}
          />
        </View>
      );
    }

    if (newGoal) {
      return (
        <View>
          <Text>Please tell me your Intermediate Goal: </Text>
          <TextInput
            style={{ borderColor: "gray", borderWidth: 1 }}
            type="text"
            placeholder="Type here!"
            value={this.props.iGoal}
            onChangeText={this.props.onChange}
          />
          <Button
            onPress={() => this.hideComponent("break")}
            title={"Submit"}
          />
        </View>
      );
    }

    if (breakTime) {
      return (
        <View>
          <Text>Take a break for the remaining time.</Text>
        </View>
      );
    }
  }

  constructor() {
    super();
    this.state = {
      showQuestion: true,
      showMet: false,
      showDone: false,
      childGoal: false,
      newGoal: false,
      BreakTime: false,
      subGoal: false,
    };
  }

  hideComponent(name) {
    switch (name) {
      case "rGoal":
        this.setState({
          showQuestion: !this.state.showQuestion,
          showMet: !this.state.showMet,
        });
        break;
      case "met":
        this.setState({
          showMet: !this.state.showMet,
          showDone: !this.state.showDone,
        });
        break;
      case "newGoal":
        this.setState({
          showQuestion: false,
          showMet: false,
          showDone: false,
          newGoal: true,
        });
        break;
      case "childGoal":
        this.setState({
          showMet: !this.state.showMet,
          childGoal: !this.state.childGoal,
        });
        break;
      case "subGoal":
        this.setState({
          childGoal: !this.state.childGoal,
          subGoal: !this.state.subGoal,
        });
        break;
      case "break":
        this.setState({
          showQuestion: false,
          showMet: false,
          showDone: false,
          childGoal: false,
          newGoal: false,
          subGoal: false,
          breakTime: true,
        });
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
