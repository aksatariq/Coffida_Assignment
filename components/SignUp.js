/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
/* eslint-disable no-else-return */
import React, { Component } from 'react';
import {
  Text, TextInput, View, StyleSheet, ScrollView, TouchableOpacity, ToastAndroid,
} from 'react-native';

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    };
  }

  signUp() {
    // validation here

    // send post request to api
    return fetch('http://10.0.2.2:3333/api/1.0.0/user',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.state),
      })

      .then((response) => {
        // check the response status we get back
        if (response.status === 201) {
          return response.json();
        } else if (response.status === 400) {
          throw new Error('Failed Validation');
        } else {
          throw new Error('Something went wrong');
        }
      })

      .then(async (responseJson) => {
        // eslint-disable-next-line prefer-template
        console.log('User created with id: ' + responseJson.id);
        this.props.navigation.navigate('login');
      })

    // show if the validation has failed.
      .catch((error) => {
        console.error(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  render() {
    return (

      <View style={styles.mainBg}>

        <ScrollView>

          <View style={styles.formItem}>
            <Text style={styles.title}>Register!</Text>
            <Text style={styles.subTitle}>Create an account</Text>
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>First Name:</Text>
            <TextInput
              style={styles.formInput}
              onChangeText={(first_name) => this.setState({ first_name })}
              value={this.state.first_name}
            />
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Last Name:</Text>
            <TextInput
              style={styles.formInput}
              onChangeText={(last_name) => this.setState({ last_name })}
              value={this.state.last_name}
            />
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Email:</Text>
            <TextInput
              style={styles.formInput}
              onChangeText={(email) => this.setState({ email })}
              value={this.state.email}
            />
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Password:</Text>
            <TextInput
              style={styles.formInput}
              secureTextEntry
              onChangeText={(password) => this.setState({ password })}
              value={this.state.password}
            />
          </View>

          {/* <View style={styles.formItem}>
            <Text style={styles.formLabel}>Confirm Password:</Text>
            <TextInput
              style={styles.formInput}
              secureTextEntry
              onChangeText={(confirmPass) => this.setState({confirmPass})}
              value={this.state.confirmPass}
            />
          </View> */}

          <View style={styles.formItem}>
            <TouchableOpacity
              style={styles.formTouch}
              onPress={() => this.signUp()}
            >
              <Text style={styles.formTouchText}>sign up</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  mainBg: {
    backgroundColor: '#001624',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',

  },
  title: {
    color: 'white',
    fontSize: 30,
    alignSelf: 'center',
    marginTop: 35,
  },
  subTitle: {
    color: 'grey',
    padding: 10,
    fontSize: 15,
    alignSelf: 'center',

  },
  formItem: {
    padding: 20,
  },
  formLabel: {
    fontSize: 15,
    color: 'grey',
  },
  formInput: {
    borderRadius: 3,
    color: 'grey',
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
  },
  formTouch: {
    backgroundColor: '#00ffea',
    borderRadius: 3,
    padding: 12,
    width: 290,
    alignSelf: 'center',
  },
  formTouchText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',

  },

});

export default SignUp;
