import React, {Component} from 'react';
import { initializeApp } from 'firebase/app';
import {View, ImageBackground, Image} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: 'AIzaSyBmYdvpfqKy3Y0H2Tr9XWsZ39EYHzA47zQ',
  authDomain: 'firecheck-e0015.firebaseapp.com',
  projectId: 'firecheck-e0015',
  storageBucket: 'firecheck-e0015.appspot.com',
  messagingSenderId: '1074915481072',
  appId: '1:1074915481072:web:3abf7773607e5821feb935',
  databaseURL: 'https://firecheck-e0015.firebaseio.com',
};

var bg = require('./Image/background.png');
var logo = require('./Image/success.png');

export default class Splash extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: true,
      redirectTo: 'Login',
    };
    initializeApp(firebaseConfig);
  }

  // Hide_Splash_Screen = () => {
  //   this.setState({
  //     isVisible: false,
  //   });
  // };

  async componentDidMount() {
    const fetched_pin = await AsyncStorage.getItem('userPin');
    // console.log('fetched pin :', fetched_pin);
    //  console.log('current user :', auth.currentUser);

    setTimeout(() => {
      if (fetched_pin !== null) {
        this.setState({
          redirectTo: 'PinSet',
          isVisible: false,
        });
      } else {
        this.setState({
          redirectTo: 'LoginPage',
          isVisible: false,
        });
      }
    }, 1000);
  }
  render() {
    let splashScreen = (
      <ImageBackground source={bg} style={{height: '100%', width: '100%'}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image source={logo} style={{height: '35%', width: '65%'}}></Image>
        </View>
      </ImageBackground>
    );
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {this.state.isVisible === true
          ? splashScreen
          : this.props.navigation.navigate(this.state.redirectTo)}
      </View>
    );
  }
}

