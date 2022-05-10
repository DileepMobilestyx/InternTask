import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {openDatabase} from 'react-native-sqlite-storage';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Table, Row} from 'react-native-table-component';

let db = openDatabase({name: 'Attendance.db'});

export default class ViewAttendance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: [],
      username: '',
      tableHead: ['Id', 'Username', 'Timestamp', 'Address'],
      widthArr: [40, 80, 100, 170],
    };
  }

  async componentDidMount() {
    const userEmail = await AsyncStorage.getItem('loginData');
    await firestore()
      .collection('Users')
      .doc(userEmail)
      .get()
      .then(documentSnapshot => documentSnapshot.get('username'))
      .then(username => {
        this.setState({username: username});
      });

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM usersAttendance where username = ?',
        [this.state.username],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i)
              temp.push([
                results.rows.item(i).id,
                results.rows.item(i).username,
                results.rows.item(i).timestamp,
                results.rows.item(i).address,
              ]);
            this.setState({userData: temp});
            console.log('userData: ', this.state.userData);
          } else {
            alert('No user found');
          }
        },
      );
    });
    console.log('userData: ', this.state.userData.username);
  }
  render() {
    const {userData} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView horizontal={true}>
          <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
            <Row
              data={this.state.tableHead}
              style={styles.header}
              textStyle={styles.text}
              widthArr={this.state.widthArr}
            />
            {userData.map((rowData, index) => (
              <Row
                key={index}
                data={rowData}
                widthArr={this.state.widthArr}
                style={[styles.row, index % 2 && {backgroundColor: '#F7F6E7'}]}
                textStyle={styles.text1}
              />
            ))}
          </Table>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  header: {height: 50, backgroundColor: '#537791'},
  text: {
    textAlign: 'center',
    fontWeight: '100',
    color: '#fff',
    fontWeight: 'bold',
  },
  text1: {textAlign: 'center', fontWeight: '100', fontWeight: 'bold'},
});
