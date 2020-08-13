import { StatusBar } from 'expo-status-bar';
import React, {useState, Component} from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class App extends Component{
  render(){
    const {
      finishedGoal,
      showMain,
      showInt,
      showTimer,
      showBreakTimer,
    } = this.state;

    return (
    <View style={styles.container}>

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
      <StatusBar style="auto" />
    </View>
  );
  }

 state = {
    finishedGoal: false,

    showMain: true,
    showInt: false,
    showTimer: false,
    showBreakTimer: false,
    break: true,
    mGoal: "",
    iGoal: "",
  }

  _mainChange = (event) => {
    this.setState({ mGoal: event });
  }

  _intChange = (event) => {
    this.setState({ iGoal: event });
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
          style={{borderColor: 'gray', borderWidth: 1}}
          type="text"
          placeholder="Type here!"
          value={this.props.mGoal}
          onChangeText={this.props.onChangeText}
        />
       <Button
        onPress={this.props.onClick}
        title={"Submit"}
        />
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
          style={{borderColor: 'gray', borderWidth: 1}}
          type="text"
          placeholder="Type here!"
          value={this.props.iGoal}
          onChangeText={this.props.onChangeText}
        />
       <Button
        onPress={this.props.onClick}
        title={"Submit"}
        />
      </View>
    );
  }
}