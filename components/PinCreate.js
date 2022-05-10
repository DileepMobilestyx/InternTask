import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {SafeAreaView} from 'react-native';
import {
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
  Text,
  TextInput,
  Alert,
} from 'react-native';

export default class PinCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '', // to store password
      passwordErrorMessage: '', // password error message
      confirmPassword: '', // to store password
      confirmPasswordErrorMessage: '', // password error message
    };
  }

  // async componentDidMount() {}

  formValidation = async () => {
    const userEmail = await AsyncStorage.getItem('loginData');
    const userPin = await AsyncStorage.getItem('userPin');
    console.log(userEmail);
    console.log(userPin);
    let errorFlag = false;  

    // input validation
    if (this.state.password.length == 0) {
      errorFlag = true;
      this.setState({passwordErrorMessage: 'Password is required feild'});
    } else if (
      this.state.password.length < 4 ||
      this.state.password.length > 4
    ) {
      errorFlag = true;
      this.setState({
        passwordErrorMessage: 'Password should be 4 char',
      });
    }
    else{
      this.setState({passwordErrorMessage: ''});
    }
    if (this.state.confirmPassword.length == 0) {
      errorFlag = true;
      this.setState({
        confirmPasswordErrorMessage: 'Confirm Password is required feild',
      });
    } else if (
      this.state.confirmPassword.length < 4 ||
      this.state.confirmPassword.length > 4
    ) {
      errorFlag = true;
      this.setState({
        confirmPasswordErrorMessage: 'Password should be 4 char',
      });
    } else if (this.state.password !== this.state.confirmPassword) {
      errorFlag = true;
      this.setState({
        confirmPasswordErrorMessage:
          'Passwoad and confirm password should be same.',
      });
    } else if (this.state.password == this.state.confirmPassword) {

        firestore()
          .collection('Users')
          .doc(userEmail)
          .update({
            userPin: this.state.password,
          })
          .then(async () => {
            await AsyncStorage.setItem('userPin', this.state.confirmPassword);
            this.props.navigation.navigate('PinSet');
            Alert.alert('Success', 'Updated Successfully');
          })
          .catch(error => {
            console.log(error);
            alert('Pin creation failed..!!');
          });   
        console.log('inside storeData');
      
      this.setState({confirmPasswordErrorMessage: ''});
      //this.setState({ loading: false });
    } else {
      alert('Please enter same pin');
    }
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1,marginTop:250}}>
        <KeyboardAvoidingView enabled>
          <View style={styles.View}>
            <Text style={styles.Pinheading}>Enter Your New Pin</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your pin"
              keyboardType="numeric"
              onChangeText={password => this.setState({password: password})}
            />
            {this.state.passwordErrorMessage.length > 0 && (
              <Text style={styles.textDanger}>
                {this.state.passwordErrorMessage}
              </Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Confirm your pin"
              keyboardType="numeric"
              onChangeText={confirmPassword =>
                this.setState({confirmPassword: confirmPassword})
              }
            />
            {this.state.confirmPasswordErrorMessage.length > 0 && (
              <Text style={styles.textDanger}>
                {this.state.confirmPasswordErrorMessage}
              </Text>
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={this.formValidation}>
              <Text style={styles.btntxt}>Create Pin</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  View: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
  },
  Pinheading: {
    height: 50,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0F2C67',
  },
  input: {
    height: 40,
    width: '80%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  button: {
    height: 40,
    width: '40%',
    backgroundColor: '#556b2f',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btntxt: {
    color: '#ffffff',
    fontSize: 20,
  },
  textDanger: {
    color: '#dc3545',
  },
});
