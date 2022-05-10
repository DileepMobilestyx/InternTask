import React, {useEffect} from 'react';
import SQLite from 'react-native-sqlite-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginPage from './components/LoginPage';
import Splash from './components/Splash';
import Registration from './components/Registration';
import PinCreate from './components/PinCreate';
import ViewProfile from './components/ViewProfile';
import PinSet from './components/PinSet';
import CreateProfile from './components/CreateProfile';
import Dashboard from './components/Dashboard';
import ViewAttendance from './components/ViewAttendance';
// import {openDatabase} from 'react-native-sqlite-storage';

// var db = openDatabase({name: 'UserDatabase.db'});

const Stack = createNativeStackNavigator();
export default function App() {
  // useEffect(() => {
  //   db.transaction(function (txn) {
  //     txn.executeSql(
  //       "SELECT name FROM sqlite_master WHERE type='table' AND name='user'",
  //       [],
  //       function (tx, res) {
  //         console.log('item:', res.rows.length);
  //         if (res.rows.length == 0) {
  //           txn.executeSql('DROP TABLE IF EXISTS user', []);
  //           txn.executeSql(
  //             'CREATE TABLE IF NOT EXISTS user(user_id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(50), email VARCHAR(50), gender VARCHAR(50), user_name VARCHAR(50), password VARCHAR(50), contact INT(10))',
  //             [],
  //           );
  //         }
  //       },
  //     );
  //   });
  // }, []);

  global.db = SQLite.openDatabase(
    {
      name: 'SQLite',
      location: 'default',
      createFromLocation: '~SQLite.db',
    },
    () => {},
    error => {
      console.log('ERROR: ' + error);
    },
  );

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="Registration" component={Registration} />
        <Stack.Screen name="PinCreate" component={PinCreate} />
        <Stack.Screen name="PinSet" component={PinSet} />
        <Stack.Screen name="ViewProfile" component={ViewProfile} />
        <Stack.Screen name="CreateProfile" component={CreateProfile} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="ViewAttendance" component={ViewAttendance} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
