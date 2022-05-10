import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getAuth} from 'firebase/auth';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native';
export default class PinSet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '', // to store password
      passwordErrorMessage: '', // password error message
    };
  }

  formValidation = async () => {
    const userEmail = await AsyncStorage.getItem('loginData');
    const userPin = await AsyncStorage.getItem('userPin');
    //this.setState({ loading: true })
    let errorFlag = false;
    let confirmPassword = await AsyncStorage.getItem('userPin');
    if (this.state.password.length == 0) {
      errorFlag = true;

      this.setState({passwordErrorMessage: 'Password is required feild'});
    } else if (this.state.password === confirmPassword) {
      this.props.navigation.navigate('CreateProfile');
    } else {
      this.setState({passwordErrorMessage: 'Please Inter Correct Password'});
    }
  };

  logOut = async () => {
    const auth = getAuth();
    await AsyncStorage.clear();
    auth.signOut().then(() => {
      alert('User signed out!');
      this.props.navigation.navigate('LoginPage');
    });
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.LoginLayout}>
          <View style={styles.LogoLayout}>
            <Text style={{fontSize: 25}}>
              Welcome {this.state.confirmPassword} !
            </Text>
            {/* <TouchableOpacity onPress={this.logOut}>
              <Text
                style={{
                  fontSize: 18,
                  marginLeft: '30%',
                  marginTop: 20,
                  color: 'blue',
                  fontWeight: '500',
                }}>
                LogOut
              </Text>
            </TouchableOpacity> */}
          </View>

          <View style={styles.inputLayout}>
            <TextInput
              placeholder="Password"
              value={this.state.password}
              keyboardType={'numeric'}
              maxLength={4}
              //secureTextEntry={true}
              style={styles.input}
              onChangeText={password => this.setState({password})}
            />
            {this.state.passwordErrorMessage.length > 0 && (
              <Text style={styles.textDanger}>
                {this.state.passwordErrorMessage}
              </Text>
            )}
          </View>

          <View style={styles.inputLayout}>
            <Button onPress={() => this.formValidation()} title="SUBMIT" />
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 15,
            }}></View>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  LoginLayout: {
    flex: 1,
    padding: 20,
  },
  LogoLayout: {
    marginLeft:'30%',
    flexDirection:'row',
    padding: 20,    
  },
  inputLayout: {
    paddingBottom: 20,
  },
  input: {
    borderWidth: 1,
  },
  textDanger: {
    color: '#dc3545',
  },
});
