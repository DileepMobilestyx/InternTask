import React, {Component} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import firestore, {firebase} from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Text,
  StyleSheet,
  View,
  } from 'react-native';

export default class ViewProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DepartmentValue: 'selectvalue',
      ShiftValue: 'selectvalue',
      DoB: '',
      DoJ: '',
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
    this.setState({DepartmentValue: doc.DepartmentValue});
    this.setState({ShiftValue: doc.ShiftValue});
    this.setState({DoB: doc.Date_of_Birth});
    this.setState({DoJ: doc.Date_of_Joining});
  }

  render() {
    
    return (
      <SafeAreaView style={styles.safeview}>
        <Text style={styles.CreateProfileheading}>
          View User Profile Details
        </Text>

        <View style={styles.ProfileBox}>
          <Text style={styles.ProfileName}>Name: </Text>
          <Text style={styles.ProfileText}>{this.state.name} </Text>
        </View>

        <View style={styles.ProfileBox}>
          <Text style={styles.ProfileName}>Email: </Text>
          <Text style={styles.ProfileText}>{this.state.email} </Text>
        </View>

        <View style={styles.ProfileBox}>
          <Text style={styles.ProfileName}>Contact: </Text>
          <Text style={styles.ProfileText}>{this.state.contact} </Text>
        </View>

        <View style={styles.ProfileBox}>
          <Text style={styles.ProfileName}>Gender :</Text>
          <Text style={styles.ProfileText}>{this.state.gender} </Text>
        </View>
        <View style={styles.ProfileBox}>
          <Text style={styles.ProfileName}>User Name :</Text>
          <Text style={styles.ProfileText}>{this.state.username}</Text>
        </View>
        <View style={styles.ProfileBox}>
          <Text style={styles.ProfileName}>Department Value :</Text>
          <Text style={styles.ProfileText}>{this.state.DepartmentValue}</Text>
        </View>

        <View style={styles.ProfileBox}>
          <Text style={styles.ProfileName}>Shift Timing :</Text>
          <Text style={styles.ProfileText}>{this.state.ShiftValue}</Text>
        </View>

        <View style={styles.ProfileBox}>
          <Text style={styles.ProfileName}>Date Of Birth: </Text>
          <Text style={styles.ProfileText}>{this.state.DoB} </Text>
        </View>
        <View style={styles.ProfileBox}>
          <Text style={styles.ProfileName}>Date Of Joining: </Text>
          <Text style={styles.ProfileText}>{this.state.DoJ} </Text>
        </View>
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
  safeview: {
    padding: 25,
    width: '100%',
    height: '100%',
    marginBottom: '10%',
  },

  ProfileName: {
    fontSize: 22,
    color: 'black',
    marginRight: 10,
    marginTop: 8,
    fontWeight: 'bold',
  },
  ProfileText: {
    fontSize: 18,
    color: 'darkslategrey',
    marginRight: 10,
    marginTop: 12,
  },

  CreateProfileheading: {
    height: 50,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0F2C67',
    textAlign: 'center',
  },
});
