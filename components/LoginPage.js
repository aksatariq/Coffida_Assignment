/* eslint-disable no-shadow */
import React, { Component } from 'react';
import {
  Text, TextInput, View, StyleSheet, ScrollView, TouchableOpacity, ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import styles from '../Styles/styles';

const loginStyles = StyleSheet.create({

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

});

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      passwordCheck: false,
      errorMessage: 'Fields must not be left blank',
      emailCheck: true,
    };
  }

  login = async () => {
    const { navigation } = this.props;
    const { email, password } = this.state;

    // validations for password
    if (password !== '') {
      if (password.length <= 6) {
        this.state.passwordCheck = false;
        this.state.errorMessage = 'Password must be greater than 6 characters!';
      } else {
        this.state.passwordCheck = true;
        this.state.errorMessage = 'Fields must not be left blank!';
      }
    } else {
      this.state.errorMessage = 'Please enter your password!';
    }

    if (email !== '') {
      // eslint-disable-next-line no-control-regex
      const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
      if (!expression.test(String(email).toLowerCase())) {
        this.state.emailCheck = false;
        this.state.errorMessage = 'Invalid email, please try again!';
      } else {
        this.state.emailCheck = true;
      }
    } else {
      this.state.errorMessage = 'Please enter your email!';
    }

    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.emailCheck && this.state.passwordCheck) {
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
          return ToastAndroid.show('Invalid email or password', ToastAndroid.SHORT);
        })
        .then(async (responseJson) => {
          const { id } = responseJson;
          await AsyncStorage.setItem('@session_token', responseJson.token);
          await AsyncStorage.setItem('@user_id', id.toString());
          navigation.navigate('main');
        })

        .catch(() => {
          ToastAndroid.show('Invalid email or password!', ToastAndroid.SHORT);
        });
    }
    // eslint-disable-next-line react/destructuring-assignment
    return ToastAndroid.show(this.state.errorMessage, ToastAndroid.SHORT);
  }

  render() {
    const { email, password } = this.state;

    return (

      <View style={loginStyles.mainBg}>
        <ScrollView>
          <View style={styles.formItem}>
            <Text style={loginStyles.title}>Login</Text>
            <Text style={loginStyles.subTitle}>Enter your email and password to login</Text>
          </View>

          <View style={styles.formItem}>
            <Text style={styles.greyText}>Email:</Text>
            <TextInput
              style={styles.greyInputText}
              onChangeText={(email) => this.setState({ email })}
              value={email}
            />
          </View>

          <View style={styles.formItem}>
            <Text style={styles.greyText}>Password:</Text>
            <TextInput
              style={styles.greyInputText}
              secureTextEntry
              onChangeText={(password) => this.setState({ password })}
              value={password}
            />
          </View>

          <View style={styles.formItem}>
            <TouchableOpacity
              accessible
              accessibilityLabel="Sign in!"
              accessibilityHint="You will be taken to the home screen, given that the user login details are correct"
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
