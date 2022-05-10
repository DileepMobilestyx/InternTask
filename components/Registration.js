import firestore, {firebase} from '@react-native-firebase/firestore';
import React from 'react';
import {RadioButton} from 'react-native-paper';
import {
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  View,
  TextInput,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native';
import auth from '@react-native-firebase/auth';


const firebaseConfig = {
  apiKey: 'AIzaSyBmYdvpfqKy3Y0H2Tr9XWsZ39EYHzA47zQ',
  authDomain: 'firecheck-e0015.firebaseapp.com',
  projectId: 'firecheck-e0015',
  storageBucket: 'firecheck-e0015.appspot.com',
  messagingSenderId: '1074915481072',
  appId: '1:1074915481072:web:3abf7773607e5821feb935',
  databaseURL: 'https://firecheck-e0015.firebaseio.com',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      f_name: '',
      validated: false,
      text: '',
      Login: '',
      gender: '',
      username: '',
      password: '',
      contact: '',
      emailErrorMsg: '',
      isSignedIn: false,
    };
  }

  // email validation
  email = emailValidation => {
    //console.log(emailValidation);
    let emailId = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/; // regular expression 
    if (emailId.test(emailValidation) === false) {
      this.setState({email: emailValidation});
      this.setState({emailError: 'Enter valid email'});
      return false;
    } else {
      this.setState({email: emailValidation});
      this.setState({emailError: ''});
    }
  };

  // password validation
  password = passwordValidation => {
    // console.log(passwordValidation);
    let pass =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/;
    if (pass.test(passwordValidation) === false) {
      this.setState({
        passwordError:
          'Password is Not In Proper Formate Use Alpha Numeric & One Special Character ',
      });
      this.setState({password: passwordValidation});
      return false;
    } else {
      this.setState({passwordError: ''});
      return false;
    }
  };

  // contact validation
  ValidateContact = () => {
    if (this.state.contact.length < 9 || this.state.contact.length > 9) {
      this.setState({contactError: 'Please enter 10 Digit number.'});
      return false;
    } else {
      this.setState({contactError: ''});
      return false;
    }
  };
  registerUser = () => {
    if (
      this.state.f_name != '' &&
      this.state.email != '' &&
      this.state.gender != '' &&
      this.state.username != '' &&
      this.state.password != '' &&
      this.state.contact != ''
    ) {
      if (
        this.state.emailError == '' &&
        this.state.passwordError == '' &&
        this.state.contactError == ''
      ) {
        auth()
          .createUserWithEmailAndPassword(this.state.email, this.state.password)
          .then(
            firestore().collection('Users').doc(this.state.email).set({
              name: this.state.f_name,
              gender: this.state.gender,
              email: this.state.email,
              username: this.state.username,
              contact: this.state.contact,
              password:this.state.password,
            }),
          )
          .then(() => {
            alert('Registration Successfull !');
            this.props.navigation.navigate('LoginPage');
          })
          .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
              this.setState({emailErrorMsg: 'Email-id already exist'});
            }
            alert('Email-id already exist!');
          });
      }
    } else {
      alert('please Fill all the details');
    }
  };

  render() {
    const {gender} = this.state;
    //const {navigation} = this.state.useNavigation();
    // AppRegistry.registerComponent('SimpleApp', () => SimpleApp);
    return (
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView enabled behavior="padding" style={styles.container}>
          <View style={styles.image}>
            <Image source={require('./Image/logo.png')} />
          </View>

          <TextInput
            style={styles.TextInput}
            placeholder={'Name'}
            placeholderTextColor="#003f5c"
            onChangeText={f_name => {
              this.setState({f_name});
            }}
            value={this.state.f_name}
          />
          {!!this.state.nameError && (
            <Text style={{color: 'red', marginLeft: '12%', width: '100%'}}>
              {this.state.nameError}
            </Text>
          )}
          <TextInput
            style={styles.TextInput}
            placeholderTextColor="#003f5c"
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Please Insert Email ID"
            onChange={this.email}
            onChangeText={emailValidation => this.email(emailValidation)}
            value={this.state.email}
          />

          {!!this.state.emailError && (
            <Text style={{color: 'red', marginLeft: '12%', width: '100%'}}>
              {this.state.emailError}
            </Text>
          )}

          <View style={{flexDirection: 'row', marginRight: '15%', padding: 1}}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'black'}}>
              Gender :{' '}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: 'black',
                marginTop: 5,
              }}>
              Male
            </Text>
            <RadioButton
              value="Male"
              status={gender === 'Male' ? 'checked' : 'unchecked'}
              onPress={() => this.setState({gender: 'Male'})}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: 'black',
                marginTop: 5,
              }}>
              Female
            </Text>
            <RadioButton
              value="Female"
              status={gender === 'Female' ? 'checked' : 'unchecked'}
              onPress={() => this.setState({gender: 'Female'})}
            />
          </View>

          <TextInput
            style={styles.TextInput}
            placeholder={'Username'}
            autoCapitalize="none"
            placeholderTextColor="#003f5c"
            onChangeText={username => {
              this.setState({username: username});
            }}
          />
          {!!this.state.usernameError && (
            <Text style={{color: 'red', marginLeft: '12%', width: '100%'}}>
              {this.state.usernameError}
            </Text>
          )}
          <TextInput
            style={styles.TextInput}
            placeholder={'Password'}
            keyboardType="email-address"
            placeholderTextColor="#003f5c"
            // onChange={this.passwordValidation}
            onChangeText={passwordValidation => {
              this.password(passwordValidation);
            }}
          />

          {!!this.state.passwordError && (
            <Text style={{color: 'red', marginLeft: '12%', width: '100%'}}>
              {this.state.passwordError}
            </Text>
          )}

          <TextInput
            style={styles.TextInput}
            placeholder={'Contact'}
            keyboardType="numeric"
            placeholderTextColor="#003f5c"
            maxLength={11}
            onChange={this.ValidateContact}
            onChangeText={contact => {
              this.setState({contact: contact});
            }}
          />
          {!!this.state.contactError && (
            <Text style={{color: 'red', marginLeft: '12%', width: '100%'}}>
              {this.state.contactError}
            </Text>
          )}

          <View style={{marginTop: 15}}>
            <View>
              <TouchableOpacity
                style={styles.button}
                onPress={this.registerUser}>
                <Text style={styles.btntxt}>Register</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 15,
              }}>
              <Text style={{marginTop: 3, marginLeft: 50}}>
                Already Register?
              </Text>
              <View style={{width: '40%', marginLeft: 10}}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('LoginPage')}>
                  <Text
                    style={{fontSize: 18, color: 'blue', fontWeight: '500'}}>
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  TextInput: {
    width: '90%',
    height: 45,
    borderRadius: 10,
    margin: 5,
    textAlign: 'justify',
    borderColor: 'gray',
    borderWidth: 2,
    padding: 10,
  },
  container: {
    margin: 15,
    width: '90%',
    height: '85%',
    marginTop: '15%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 40,
    width: '60%',
    marginLeft: '20%',
    backgroundColor: '#6E3CBC',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btntxt: {
    color: '#ffffff',
    fontSize: 20,
  },
});
