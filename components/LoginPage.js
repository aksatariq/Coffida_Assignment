/* eslint-disable no-shadow */
import React, { Component } from 'react';
import {
  Text, TextInput, View, StyleSheet, ScrollView, TouchableOpacity, ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

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

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  login = async () => {
    const { navigation } = this.props;

    return fetch('http://10.0.2.2:3333/api/1.0.0/user/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.state),
      })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      })
      .then(async (responseJson) => {
        const { id } = responseJson;
        await AsyncStorage.setItem('@session_token', responseJson.token);
        await AsyncStorage.setItem('@user_id', id.toString());
        navigation.navigate('main');
      })

      .catch(() => {
        ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
      });
  }

  render() {
    const { email, password } = this.state;

    return (

      <View style={styles.mainBg}>
        <ScrollView>
          <View style={styles.formItem}>
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subTitle}>Enter your email and password to login</Text>
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Email:</Text>
            <TextInput
              style={styles.formInput}
              onChangeText={(email) => this.setState({ email })}
              value={email}
            />
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Password:</Text>
            <TextInput
              style={styles.formInput}
              secureTextEntry
              onChangeText={(password) => this.setState({ password })}
              value={password}
            />
          </View>

          <View style={styles.formItem}>
            <TouchableOpacity
              style={styles.formTouch}
              onPress={() => this.login()}
            >
              <Text style={styles.formTouchText}>sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

    );
  }
}

LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    addListener: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default LoginScreen;
