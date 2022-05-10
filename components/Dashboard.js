import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getAuth} from 'firebase/auth';
import LogoutImg from './assets/logout.png';
import NetInfo from '@react-native-community/netinfo';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import Geolocation from 'react-native-geolocation-service';
import {openDatabase} from 'react-native-sqlite-storage';
import {BackHandler} from 'react-native';
import Geocoder from 'react-native-geocoder';

let db = openDatabase({name: 'Attendance.db'});

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ButtonStateHolder: '',
      latitude: '',
      longitude: '',
      location: '',
      userEmail: '',
      username: '',
      timestamp: '',
      attendBtnStateHolder: false,
      date: '',
      lastDate: '',
    };
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='usersAttendance'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);

          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS usersAttendance', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS usersAttendance(id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(15), timestamp VARCHAR(50), address VARCHAR(100))',
              [],
            );
          }
        },
      );
    });
  }

  async componentDidMount() {
    const userEmail = await AsyncStorage.getItem('loginData');
    this.setState({userEmail: userEmail});
    console.log('useremail:', userEmail);

    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this),
    );
    NetInfo.addEventListener(state => {
      if (state.isConnected) {
        console.log('net on sync');
        this.setState({
          ButtonStateHolder: false,
        });
      } else {
        this.setState({
          ButtonStateHolder: true,
        });
      }
    });

    const date = moment().utcOffset('+05:30').format('DD-MM-YYYY');
    this.setState({date: date});
    console.log('date:', this.state.date);

    const lastDate = await AsyncStorage.getItem('todaysDate');
    this.setState({lastDate: lastDate});
    console.log('todays date:', lastDate);

    //setting button disable for 1 day
    if (this.state.lastDate == this.state.date) {
      this.setState({
        attendBtnStateHolder: true,
      });
    } else {
      this.setState({
        attendBtnStateHolder: false,
      });
    }

    //getting username
    await firestore()
      .collection('Users')
      .doc(userEmail)
      .get()
      .then(documentSnapshot => documentSnapshot.get('username'))
      .then(username => {
        this.setState({username: username});
      });
    console.log('username: ', this.state.username);
    //getting location
    Geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        console.log("lang "+position.coords.latitude);
        console.log('long ' + position.coords.longitude);

        var position2 = {
          lat: this.state.latitude,
          lng: this.state.longitude,
        };

        Geocoder.geocodePosition(position2)
          .then(json => {
            let address = JSON.stringify(json[0].formattedAddress);
            this.setState({
              location: address,
            });
            console.log('location:', this.state.location);
          })
          .catch(error => console.log(error));
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: false, timeout: 10000, maximumAge: 100000},
    );
  }

  handleBackButton() {
    BackHandler.exitApp();
  }
  MarkAttendance = async () => {
    await AsyncStorage.setItem('todaysDate', this.state.date);
    this.setState({attendBtnStateHolder: true});
    //getting timestamp
    const timestamp = moment()
      .utcOffset('+05:30')
      .format('DD-MM-YYYY hh:mm:ss a');
    this.setState({timestamp: timestamp});
    console.log('timeStamp:', this.state.timestamp);

    //send data to local database
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO usersAttendance (username, timestamp, address) VALUES (?,?,?)',
        [this.state.username, this.state.timestamp, this.state.location],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            alert('Attendance marked !');
          } else {
            alert('Please try again !');
          }
        },
      );
    });
  };

  logOut = async () => {
    const auth = getAuth();
    await AsyncStorage.clear();
    auth.signOut().then(() => {
      alert('User signed out!');
      this.props.navigation.navigate('LoginPage');
    });
  };
  RedirectProfile = () => {
    this.props.navigation.navigate('ViewProfile');
  };
  RedirectUpdate = () => {
    this.props.navigation.navigate('CreateProfile');
  };
  ViewAttendance = () => {
    this.props.navigation.navigate('ViewAttendance');
  };

  syncAttendance = async () => {
    console.log('firing');
    let user_name = '';
    const userEmail = await AsyncStorage.getItem('loginData');
    await firestore()
      .collection('Users')
      .doc(userEmail)
      .get()
      .then(documentSnapshot => documentSnapshot.get('username'))
      .then(username => {
        user_name = username;
      });

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM usersAttendance where username = ?',
        [user_name],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i)
              temp.push(results.rows.item(i));
            temp.forEach(item => {
              firestore()
                .collection('Attendance')
                .doc(item.username + '' + item.timestamp)
                .set(item)
                .then(() => {
                  alert('User added!');
                })
                .catch(err => console.log(err));
            });
          } else {
            alert('No user found');
          }
        },
      );
    });
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.topbar}>
          <TouchableOpacity onPress={this.logOut}>
            <Image style={styles.image} source={LogoutImg}></Image>
          </TouchableOpacity>
        </View>
        <View style={styles.View}>
          <TouchableOpacity
            style={styles.button}
            onPress={this.RedirectProfile}>
            <Text style={styles.btntxt}>View Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.RedirectUpdate}>
            <Text style={styles.btntxt}>Update Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: this.state.attendBtnStateHolder
                  ? '#607D8B'
                  : '#22577E',
              },
            ]}
            activeOpacity={0.3}
            onPress={this.MarkAttendance}
            disabled={this.state.attendBtnStateHolder}>
            <Text style={styles.btntxt}>Mark Attendance</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.ViewAttendance}>
            <Text style={styles.btntxt}>View Attendance</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: this.state.ButtonStateHolder
                  ? '#607D8B'
                  : '#22577E',
              },
            ]}
            activeOpacity={0.3}
            disabled={this.state.ButtonStateHolder}>
            <Text style={styles.btntxt} onPress={this.syncAttendance}>
              Sync Attendance
            </Text>
          </TouchableOpacity>
        </View>
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
  topbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: '#292C6D',
  },
  View: {
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:'#000000'
  },
  button: {
    height: 50,
    width: '70%',
    backgroundColor: '#22577E',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#161853',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 15,
  },
  btntxt: {
    color: '#ffffff',
    fontSize: 20,
  },
  image: {
    height: 30,
    width: 30,
    margin: 7,
    marginRight: 10,
  },
});
