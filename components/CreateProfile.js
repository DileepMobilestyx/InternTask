import React, {Component} from 'react';
import {Picker} from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import {RadioButton} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore,{firebase} from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';

export default class CreateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DepartmentValue: 'selectvalue',
      ShiftValue: 'selectvalue',
      DoB: '',
      DoJ: '',
      show: false,
      show1: false,
      name: '',
      email: '',
      gender: '',
      username: '',
      contact: '',
      emailError: '',
      contactError: '',
    };
  }

  async componentDidMount() {
    const userEmail = await AsyncStorage.getItem('loginData');
    const userDocument = await firestore()
      .collection('Users')
      .doc(userEmail)
      .get();
    // console.log(userDocument)
    let doc = userDocument.data();
    this.setState({name: doc.name});
    this.setState({email: doc.email});
    this.setState({contact: doc.contact});
    this.setState({gender: doc.gender});
    this.setState({username: doc.username});
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
  // for dob
  onChangeDob = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.DoB;
    let storedate = currentDate.toLocaleDateString();
    this.setState({show: false});
    this.setState({DoB: storedate});
  };
  showMode = () => {
    this.setState({show: true});
  };

  //for doj
  onChangeDoj = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.DoJ;
    let storedate1 = currentDate.toLocaleDateString();
    this.setState({show1: false});
    this.setState({DoJ: storedate1});
  };
  showMode1 = () => {
    this.setState({show1: true});
  };
  registerUser = async () => {
    const userEmail = await AsyncStorage.getItem('loginData');
    if (
      this.state.name != '' &&
      this.state.email != '' &&
      this.state.gender != '' &&
      this.state.contact != '' &&
      this.state.Date_of_Birth != '' &&
      this.state.Date_of_Joining != '' &&
      this.state.DepartmentValue != 'selectvalue' &&
      this.state.ShiftValue != 'selectvalue' &&
      this.state.gender != ''
    ) {
      if (this.state.emailError == '' && this.state.contactError == '') {
        firestore()
          .collection('Users')
          .doc(userEmail)
          .update({
            name: this.state.name,
            gender: this.state.gender,
            email: this.state.email,
            contact: this.state.contact,
            Date_of_Birth: this.state.DoB,
            Date_of_Joining: this.state.DoJ,
            DepartmentValue: this.state.DepartmentValue,
            ShiftValue: this.state.ShiftValue,
          })
          .then(() => {
            alert('Profile Created Successfully !');
            this.props.navigation.navigate('Dashboard');
          })
          .catch(error => {
            console.log(error);
            alert('Profile creation failed !');
          });
      }
    } else {
      alert('Please Fill all the details');
    }
  };

  render() {
    const {gender} = this.state;

    return (
      <SafeAreaView style={{flex: 1,padding:15,}}>
        <KeyboardAvoidingView enabled>
          <Text style={styles.CreateProfileheading}>Update User Profile</Text>

          <View style={styles.ProfileBox}>
            <Text style={styles.ProfileText}>Name: </Text>
            <TextInput
              style={styles.TextInput}
              placeholder={' Name'}
              value={this.state.name}
              placeholderTextColor="#003f5c"
              onChangeText={name => {
                this.setState({name: name});
              }}
            />
          </View>

          <View style={styles.ProfileBox}>
            <Text style={styles.ProfileText}>Email: </Text>
            <TextInput
              style={styles.TextInput}
              placeholderTextColor="#003f5c"
              editable={false}
              selectTextOnFocus={true}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder=" Please Insert Email ID"
              onChangeText={emailValidation => this.email(emailValidation)}
              value={this.state.email}
            />

            {!!this.state.emailError && (
              <Text style={{color: 'red', marginLeft: '12%', width: '100%'}}>
                {this.state.emailError}
              </Text>
            )}
          </View>

          <View style={styles.ProfileBox}>
            <Text style={styles.ProfileText}>Contact: </Text>
            <TextInput
              style={styles.TextInput1}
              placeholder={' Contact Number'}
              keyboardType="numeric"
              placeholderTextColor="#003f5c"
              maxLength={15}
              value={this.state.contact}
              onChangeText={contact => {
                this.setState({contact: contact});
              }}
            />
            {!!this.state.contactError && (
              <Text style={{color: 'red', marginLeft: '12%', width: '100%'}}>
                {this.state.contactError}
              </Text>
            )}
          </View>

          <View
            style={{
              //textAlign: 'left',
              flexDirection: 'row',
              marginRight: '15%',
              padding: 1,
            }}>
            <Text style={{fontSize: 16, color: 'black'}}>Gender : </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: 'black',
                marginTop: 2,
                marginLeft: '5%',
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
                marginTop: 2,
              }}>
              Female
            </Text>
            <RadioButton
              value="Female"
              status={gender === 'Female' ? 'checked' : 'unchecked'}
              onPress={() => this.setState({gender: 'Female'})}
            />
          </View>
          <View style={styles.ProfileBox}>
            <Text style={{fontSize: 16, color: 'black'}}>UserName :</Text>
            <Text
              style={{
                fontSize: 22,
                marginTop: -5,
                fontWeight: '600',
                marginLeft: 10,
                color: 'cadetblue',
              }}>
              {this.state.username}
            </Text>
          </View>
          <View style={styles.ProfileBox}>
            <Text style={{fontSize: 16, color: 'black', marginTop: 18}}>
              DepartmentValue :
            </Text>
            <Picker
              // style={styles.pickerStyle}
              style={{width: '67%', marginTop: 4, marginLeft: -10}}
              selectedValue={this.state.DepartmentValue}
              onValueChange={itemValue =>
                this.setState({DepartmentValue: itemValue})
              }>
              <Picker.Item label=" Select Department" value="selectvalue" />
              <Picker.Item label="Mobile" value="Mobile" />
              <Picker.Item label="PHP" value="PHP" />
              <Picker.Item label="Design" value="Design" />
              <Picker.Item label="Sales" value="Sales" />
              <Picker.Item label="Support" value="Support" />
              <Picker.Item label="HR" value="HR" />
            </Picker>
          </View>

          <View style={styles.ProfileBox}>
            <Text style={{fontSize: 16, color: 'black', }}>
              Shift Value :
            </Text>
            <Picker
              style={{width: '67%',marginTop:-15, marginLeft: 35}}
              selectedValue={this.state.ShiftValue}
              onValueChange={itemValue =>
                this.setState({ShiftValue: itemValue})
              }>
              <Picker.Item label=" Select Shift Timing " value="selectvalue" />
              <Picker.Item label="Morning" value="Morning" />
              <Picker.Item label="AfterNoon" value="AfterNoon" />
              <Picker.Item label="Night" value="Night" />
            </Picker>
          </View>

          <View style={styles.ProfileBox}>
            <Text style={styles.ProfileText}>Date Of Birth: </Text>
            <TextInput
              onFocus={this.showMode}
              placeholder={'Select Date Of Birth'}
              value={this.state.DoB}
              style={styles.input1}></TextInput>
            {this.state.show && (
              <DateTimePicker
                testID="datePicker"
                value={new Date()}
                mode="date"
                display="default"
                onChange={this.onChangeDob}
              />
            )}
          </View>
          <View style={styles.ProfileBox}>
            <Text style={styles.ProfileText}>Date Of Joining: </Text>
            <TextInput
              onFocus={this.showMode1}
              placeholder={'Select Date Of Joining'}
              value={this.state.DoJ}
              style={styles.input2}></TextInput>
            {this.state.show1 && (
              <DateTimePicker
                testID="datePicker"
                value={new Date()}
                mode="date"
                display="default"
                onChange={this.onChangeDoj}
              />
            )}
          </View>
          <View>
            <TouchableOpacity style={styles.button} onPress={this.registerUser}>
              <Text style={styles.btntxt}>Submit</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  ProfileBox: {
    flexDirection: 'row',
    width: '90%',
    margin: 5,
  },
  button: {
    height: 40,
    width: '40%',
    backgroundColor: '#3cb371',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginLeft: '30%',
  },
  TextInput: {
    borderRadius: 10,
    borderWidth: 2,
    width: '75%',
    color: 'black',
    height: 35,
    marginLeft: 15,
  },
  TextInput1: {
    borderRadius: 10,
    borderWidth: 2,
    width: '75%',
    height: 35,
    //marginLeft: 15,
  },
  dropdown: {
    fontSize: 25,
    fontWeight: 'bold',
    width: '20%',
    height: '7%',
    borderRadius: 10,
    flexDirection: 'row',
  },
  ProfileText: {
    fontSize: 16,
    color: 'black',
    marginRight: 10,
    marginTop: 8,
  },
  input1: {
    borderRadius: 10,
    borderWidth: 2,
    width: '55%',
    height: 35,
    marginLeft: 18,
  },
  input2: {
    borderRadius: 10,
    borderWidth: 2,
    width: '55%',
    height: 35,
  },
  CreateProfileheading: {
    height: 50,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0F2C67',
    textAlign: 'center',
  },
});
