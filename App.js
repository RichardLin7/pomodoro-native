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
      setInt,
      stopBreak,
    } = this.state;

    if (finishedGoal === false && showBreakTimer === false) {
      return (
        <View style={styles.container}>
          {showTimer && (
            <CountdownCircle
              seconds={1320} // bruh it don't fit.
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
          {this.state.child.map((child, i) => {
            return (
              <Text>
                Intermediate Goal {i + 1}: {this.state.child[i]}
              </Text>
            );
          })}
          {showTimer && <Button title={"Skip Timer"} onPress={this._22Timer} />}

          {/* Here begins transitions and questions. */}

          <Text></Text>
          {showMain && (
            <Main
              onClick={() => this.hideComponent("setInt")}
              mGoal={this.state.mGoal}
              onChangeText={this._mainChange}
            />
          )}

          {setInt && (
            <View>
              <Text>
                Would you like to set a Intermediate Goal for the previous Goal?
              </Text>
              <Button
                title={"Yes"}
                onPress={() => this.hideComponent("showInt")}
              />
              <Button
                title={"No"}
                onPress={() => this.hideComponent("showTimer")}
              />
            </View>
          )}

          {showInt && (
            <View>
              <Text>Please tell me your Intermediate Goal: </Text>
              <TextInput
                style={{ borderColor: "gray", borderWidth: 1 }}
                type="text"
                placeholder="Type here!"
                value={this.state.sGoal}
                onChangeText={this._subChange}
              />
              <Button onPress={this._newInt} title={"Submit"} />
            </View>
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
                seconds={480}
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

              {this.state.child.map((child, i) => {
                return (
                  <Text>
                    Intermediate Goal {i + 1}: {this.state.child[i]}
                  </Text>
                );
              })}
              <Text></Text>
              <Question
                index={this.state.index}
                isFinished={this._isFinished}
                sGoal={this.state.sGoal}
                onChange={this._intChange}
                subText={this._subChange}
                _subGoal={this._subGoal}
                _removeSub={this._removeSub}
                mGoal={this.state.mGoal}
                onChangeText={this._mainChange}
              />
              <Text></Text>
              <Button title={"Skip Timer"} onPress={this._8Timer} />
              <StatusBar style="auto" />
            </View>
          )}

          {stopBreak && (
            <View>
              <Text>Break Time Over! Click to Continue...</Text>
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
      setInt: false,
      showInt: false,
      showTimer: false,
      showBreakTimer: false,
      break: true,

      stopTime: false,
      stopBreak: false,
      index: 0,
      child: [],

      mGoal: "",

      sGoal: "",
    };

    this._isFinished = this._isFinished.bind(this);
    this._showQuestion = this._showQuestion.bind(this);
    this._mainChange = this._mainChange.bind(this);
    this._newInt = this._newInt.bind(this);

    this._subChange = this._subChange.bind(this);
    this._breakOver = this._breakOver.bind(this);
    this._22Timer = this._22Timer.bind(this);
    this._8Timer = this._8Timer.bind(this);
    this._subGoal = this._subGoal.bind(this);
    this._removeSub = this._removeSub.bind(this);
  }

  _mainChange(event) {
    this.setState({ mGoal: event });
  }

  _newInt() {
    this._subGoal();
    this.hideComponent("setInt");
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

  _subGoal() {
    this.setState({
      child: this.state.child.concat(this.state.sGoal),
      index: this.state.index + 1,
    });
  }

  _removeSub() {
    const child = this.state.child;
    if (this.state.index === 0) {
      return;
    } else {
      var nChild = child.slice(0, -1);
      this.setState({
        child: nChild,
        index: this.state.index - 1,
      });
    }
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
      case "setInt":
        this.setState({ showMain: false, setInt: true, showInt: false });
        break;
      case "showInt":
        this.setState({ setInt: false, showInt: true });
        break;
      case "showTimer":
        this.setState({ showInt: false, setInt: false, showTimer: true });
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
      setMain,
      setInt,
      newInt,
      showDone,
      newGoal,
      breakTime,
      childGoal,
      subGoal,
    } = this.state;

    if (this.props.index === 0) {
      if (showQuestion) {
        return (
          <View>
            <Text></Text>
            <Text>Did you complete the Main Goal?</Text>
            <Text></Text>
            <Button
              onPress={() => this.hideComponent("showDone")}
              title={"Yes"}
            />
            <Button onPress={() => this.hideComponent("setInt")} title={"No"} />
          </View>
        );
      }
      if (setInt) {
        return (
          <View>
            <Text></Text>
            <Text>
              Would you like to set a Intermediate Goal to help solve the Main
              Goal?
            </Text>
            <Text></Text>
            <Button
              onPress={() => this.hideComponent("newInt")}
              title={"Yes"}
            />
            <Button onPress={() => this.hideComponent("break")} title={"No"} />
          </View>
        );
      }
      if (setMain) {
        return (
          <View>
            <Text>Please tell me your new Main Goal: </Text>
            <TextInput
              style={{ borderColor: "gray", borderWidth: 1 }}
              type="text"
              placeholder="Type here!"
              value={this.props.mGoal}
              onChangeText={this.props.onChangeText}
            />
            <Button
              onPress={() => this.hideComponent("break")}
              title={"Submit"}
            />
          </View>
        );
      }
      if (newInt) {
        return (
          <View>
            <Text>Please tell me your new Intermediate Goal: </Text>
            <TextInput
              style={{ borderColor: "gray", borderWidth: 1 }}
              type="text"
              placeholder="Type here!"
              value={this.props.sGoal}
              onChangeText={this.props.subText}
            />
            <Button onPress={this._newSub} title={"Submit"} />
          </View>
        );
      }
      if (showDone) {
        return (
          <View>
            <Text></Text>
            <Text>Would you like to set a new Main Goal or are you done?</Text>
            <Text></Text>
            <Button
              onPress={() => this.hideComponent("setMain")}
              title={"Set New Main Goal"}
            />
            <Button onPress={this.props.isFinished} title={"Done"} />
          </View>
        );
      }
    }
    ///////////////////////////////////////////////////////////////
    if (this.props.index !== 0) {
      if (showQuestion) {
        return (
          <View>
            <Text></Text>
            <Text>Was Intermediate Goal relevant?</Text>
            <Text></Text>
            <Button
              onPress={() => this.hideComponent("showMet")}
              title={"Yes"}
            />
            <Button
              onPress={this._newGoal} // please edit since it does not modifiy previously set goal
              title={"No"}
            />
          </View>
        );
      }
      if (showMet) {
        return (
          <View>
            <Text></Text>
            <Text>Has Intermediate Goal been met?</Text>
            <Text></Text>
            <Button onPress={this._remSub} title={"Yes"} />
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
              Would you like to set another Intermediate Goal for this
              Intermediate Goal?
            </Text>
            <Text></Text>
            <Button
              onPress={() => this.hideComponent("subGoal")}
              title={"Yes"}
            />
            <Button onPress={() => this.hideComponent("break")} title={"No"} />
          </View>
        );
      }
      if (subGoal) {
        return (
          <View>
            <Text>Please tell me your new Intermediate Goal: </Text>
            <TextInput
              style={{ borderColor: "gray", borderWidth: 1 }}
              type="text"
              placeholder="Type here!"
              value={this.props.sGoal}
              onChangeText={this.props.subText}
            />
            <Button onPress={this._newSub} title={"Submit"} />
          </View>
        );
      }
      if (showDone) {
        return (
          <View>
            <Text></Text>
            <Text>
              Would you like continue with current Intermediate Goal, set a new
              Intermediate Goal, or are you done with the Main Goal?
            </Text>
            <Text></Text>
            <Button
              onPress={() => this.hideComponent("break")}
              title={"Continue"}
            />
            <Button
              onPress={() => this.hideComponent("newGoal")}
              title={"New Intermediate Goal"}
            />
            <Button
              onPress={this.props.isFinished}
              title={"Done with Main Goal"}
            />
          </View>
        );
      }
    }

    if (newGoal) {
      return (
        <View>
          <Text>Please set a better Intermediate Goal: </Text>
          <TextInput
            style={{ borderColor: "gray", borderWidth: 1 }}
            type="text"
            placeholder="Type here!"
            value={this.props.sGoal}
            onChangeText={this.props.subText}
          />
          <Button onPress={this._newSub} title={"Submit"} />
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
      setMain: false,
      setInt: false,
      newInt: false,
      showDone: false,
      childGoal: false,
      newGoal: false,
      breakTime: false,
      subGoal: false,
    };

    this._newGoal = this._newGoal.bind(this);
    this._newSub = this._newSub.bind(this);
    this._remSub = this._remSub.bind(this);
  }

  _newGoal() {
    this._remSub();
    this.hideComponent("newGoal");
  }
  _newSub() {
    this.props._subGoal();
    this.hideComponent("break");
  }

  _remSub() {
    this.props._removeSub();
    this.hideComponent("showDone");
  }

  hideComponent(name) {
    switch (name) {
      case "showMet":
        this.setState({
          showQuestion: !this.state.showQuestion,
          showMet: !this.state.showMet,
        });
        break;
      case "setInt":
        this.setState({
          showQuestion: false,
          showMet: false,
          setInt: true,
        });
        break;
      case "newInt":
        this.setState({
          showQuestion: false,
          showMet: false,
          setInt: false,
          newInt: true,
        });
        break;
      case "showDone":
        this.setState({
          showQuestion: false,
          showMet: false,
          showDone: true,
        });
        break;
      case "setMain":
        this.setState({
          showDone: false,
          setMain: true,
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
          setMain: false,
          setInt: false,
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
