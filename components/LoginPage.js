import {
  Text,
  StyleSheet,
  View,
  TextInput,
  KeyboardAvoidingView,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, {Component} from 'react';
import {SafeAreaView} from 'react-native';
import firestore,{firebase} from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '', // to store username
      password: '', // to store password
      userpin1:''  // to store pin for pin login 
    };
  }

  userLogin = async () => {
     firestore()
       .collection('Users')
       .doc(this.state.email)
       .get()
       .then(documentSnapshot => documentSnapshot.get('userPin'))
       .then(userpin => {
         this.setState({userpin1 : userpin})
       });

      if (this.state.email != '' && this.state.password != '') {        
        firebase
          .auth()
          .signInWithEmailAndPassword(this.state.email, this.state.password)
          .then(async userCredentials => {
            alert("You've successfully logged in !");
            // this.state.userpin2 !== ''
            if (this.state.userpin1 !== undefined) {
              this.props.navigation.navigate('PinSet');
              console.log('in enter pin');
            } else {
              this.props.navigation.navigate('PinCreate');
              console.log('in set pin');
            }
            await AsyncStorage.setItem('loginData', userCredentials.user.email);
            await AsyncStorage.setItem('userPin', this.state.userpin1);
          })
          .catch(error => {
            if (error.code === 'auth/user-not-found') {
              alert('Please enter valid email-id');
            }
            if (error.code === 'auth/wrong-password') {
              alert('Please enter correct password!');
            }
          });
      } 
      else 
      {
        Alert.alert('Enter details to SignIn');
      };        
    }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView enabled>
          <View style={styles.container}>
            <View style={styles.image}>
              <Image source={require('./Image/logo.png')} />
            </View>

            <View style={styles.TextInput}>
              <TextInput
                placeholder={'Email'}
                placeholderTextColor="#003f5c"
                autoCapitalize="none"
                keyboardType="email-address"
                value={this.state.email}
                onChangeText={email => this.setState({email})}
              />
              {!!this.state.emailError && (
                <Text style={{color: 'red'}}>{this.state.emailError}</Text>
              )}
            </View>
            <View style={styles.TextInput}>
              <TextInput
                keyboardType="email-address"
                placeholder={'Password'}
                placeholderTextColor="#003f5c"
                onChangeText={password => this.setState({password})}
              />
              {!!this.state.passwordError && (
                <Text style={{color: 'red'}}>{this.state.passwordError}</Text>
              )}
            </View>

            <View style={{width: '60%'}}>
              <TouchableOpacity
                style={styles.touch}
                onPress={() => this.userLogin()}>
                <Text style={{color: 'white'}}>Login</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginLeft: 40,
                marginTop: 15,
              }}>
              <Text style={{marginTop: 5, fontSize: 16}}>
                Didn't Have an ID ?
              </Text>
              <View style={{width: '40%'}}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('Registration')
                  }>
                  <Text
                    style={{
                      fontSize: 18,
                      margin: 2,
                      color: 'blue',
                      fontWeight: '500',
                    }}>
                    Create Hear
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
    width: '100%',
    height: 50,
    borderRadius: 10,
    textAlign: 'auto',
    borderColor: 'gray',
    borderWidth: 2,
    margin: 15,
  },
  container: {
    marginTop: '25%',
    width: '85%',
    height: '70%',
    padding: 2,
    margin: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    //justifyContent: 'center',
  },
  image: {
    marginTop: 35,
  },
  touch: {
    borderWidth: 1,
    justifyContent: 'center',
    backgroundColor: 'gray',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    height: 40,
    width: '80%',
  },
  textDanger: {
    color: '#dc3545',
  },
});

export default LoginPage;
