/* eslint-disable no-else-return */
/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-expressions */
/* eslint-disable eqeqeq */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
import React, { Component } from 'react';
import {
  Text, TextInput, View, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      id: '',
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      confirm_password: '',
      orig_email: '',
      orig_first_name: '',
      orig_last_name: '',
      isLoading: true,
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedin();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

    checkLoggedin = async () => {
      const tokenId = await AsyncStorage.getItem('@session_token');

      // check if token exists
      if (tokenId != null) {
        // get the user id
        const userId = await AsyncStorage.getItem('@user_id');

        // store the token
        this.setState({ token: tokenId });
        this.setState({ id: userId });

        // navigate to settings page
        this.props.navigation.navigate('settings');

        // get the data to display on page
        this.getData();
      }
    }

    getData = () => {
      console.log('getting data...');
      // eslint-disable-next-line prefer-template
      return fetch('http://10.0.2.2:3333/api/1.0.0/user/' + this.state.id,
        {
          headers: {
            'X-Authorization': this.state.token,
          },
        })
        .then((response) => {
          console.log(response.status);

          if (response.status === 200) {
            return response.json();
          } if (response.status === '400') {
            throw new Error('Invalid Email or Password!');
          } else {
            throw new Error('Something went wrong');
          }
        })
        .then(async (responseJson) => {
          this.setState({ orig_email: responseJson.email });
          this.setState({ orig_first_name: responseJson.first_name });
          this.setState({ orig_last_name: responseJson.last_name });

          this.setState({ email: responseJson.email });
          this.setState({ first_name: responseJson.first_name });
          this.setState({
            last_name: responseJson.last_name,
            isLoading: false,
          });

          this.props.navigation.navigate('main');
        })

        .catch((error) => {
          console.error(error);
          ToastAndroid.show(error, ToastAndroid.SHORT);
        });
    }

    logout = async () => fetch('http://10.0.2.2:3333/api/1.0.0/user/logout', {
      method: 'POST',
      headers: {
        'X-Authorization': this.state.token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.state.token = '';
          this.props.navigation.navigate('home');
          AsyncStorage.removeItem('@session_token');
        }
      })
      .catch((error) => {
        console.log(error);
      })

    async updateUser() {
      const toSend = {};
      // eslint-disable-next-line prefer-const
      let sendBool = true;

      if (this.state.email != this.state.orig_email) {
        toSend.email = this.state.email;
        // eslint-disable-next-line no-unused-expressions
        sendBool === true;
        console.log('here');
      }

      if (this.state.first_name != this.state.orig_first_name) {
        toSend.first_name = this.state.first_name;
        sendBool === true;
        console.log('here');
      }

      if (this.state.last_name != this.state.orig_last_name) {
        toSend.last_name = this.state.last_name;
        sendBool === true;
      }

      if (this.state.password == this.state.confirm_password && this.state.password != '') {
        toSend.password = this.state.password;
        sendBool === true;
      }

      console.log(toSend);
      console.log(sendBool);

      // check to see if any changes made
      if (sendBool == true) {
        // send PATCH request to api
        try {
          // eslint-disable-next-line prefer-template
          const response = await fetch('http://10.0.2.2:3333/api/1.0.0/user/' + this.state.id,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'X-Authorization': this.state.token,
              },
              body: JSON.stringify(toSend),
            });
          // check the response status we get back
          if (response.status == 200) {
            ToastAndroid.show('Details updated', ToastAndroid.SHORT);
          } else if (response.status == 400) {
            throw new Error('Failed Validation');
          } else {
            throw new Error('Failed to update, please try again');
          }
        } catch (error) {
          console.error(error);
          ToastAndroid.show(error, ToastAndroid.SHORT);
        }
      }
      ToastAndroid.show('You have not made any changes!', ToastAndroid.SHORT);
    }

    render() {
      if (this.state.isLoading) {
        return (
          <View style={styles.mainBg}>
            <ActivityIndicator
              size="large"
              color="#00ff00"
              style={{ alignSelf: 'center' }}
            />
          </View>
        );
      } else {
        return (

          <View style={styles.mainBg}>
            <ScrollView>
              <View style={styles.formItem}>
                <Text style={styles.title}>Manage your account</Text>
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
                  onChangeText={(password) => this.setState({ password })}
                  value={this.state.password}
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Confirm Password:</Text>
                <TextInput
                  style={styles.formInput}
                  onChangeText={(confirm_password) => this.setState({ confirm_password })}
                  value={this.state.confirm_password}
                />
              </View>

              <View style={styles.formItem}>
                <TouchableOpacity
                  style={styles.formTouch}
                  onPress={() => this.updateUser()}
                >
                  <Text style={styles.formTouchText}>update</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formItem}>
                <TouchableOpacity
                  style={styles.formTouch}
                  onPress={() => this.logout()}
                >
                  <Text style={styles.formTouchText}>logout</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

        );
      }
    }
}

SettingsScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

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
    marginTop: 20,
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

export default SettingsScreen;
