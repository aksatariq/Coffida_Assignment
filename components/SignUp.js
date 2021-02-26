/* eslint-disable no-shadow */
import React, { Component } from 'react';
import {
  Text, TextInput, View, StyleSheet, ScrollView, TouchableOpacity, ToastAndroid,
} from 'react-native';
import PropTypes from 'prop-types';
import { checkAllFields } from './Utils';

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
class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordCheck: true,
      errorMessage: 'Fields must not be left blank',
      emailCheck: true,
    };
  }

  signUp() {
    const { navigation } = this.props;
    const {
      email, password, firstName, lastName,
    } = this.state;
    const toSend = {};

    toSend.email = email;
    toSend.password = password;
    toSend.first_name = firstName;
    toSend.last_name = lastName;

    // validate email with regex
    if (email !== '') {
      // eslint-disable-next-line no-control-regex
      const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
      if (!expression.test(String(email).toLowerCase())) {
        this.state.emailCheck = false;
        this.state.errorMessage = 'Invalid email, please try again!';
      } else {
        this.state.emailCheck = true;
        // set back to default error message
        this.state.errorMessage = 'Fields cannot be left blank!';
      }
    }

    // validations for password
    if (password !== '') {
      if (password.length <= 6) {
        this.state.passwordCheck = false;
        this.state.errorMessage = 'Password must be greater than 6 characters!';
      } else {
        this.state.passwordCheck = true;
      }
    }

    // eslint-disable-next-line react/destructuring-assignment
    if (checkAllFields(toSend) && this.state.emailCheck && this.state.passwordCheck) {
    // send post request to api
      return fetch('http://10.0.2.2:3333/api/1.0.0/user',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(toSend),
        })

        .then((response) => {
        // check the response status we get back
          if (response.status === 201) {
            return response.json();
          }
          return ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
        })
        .then(async () => {
        // eslint-disable-next-line prefer-template
          navigation.navigate('login');
          ToastAndroid.show('Signup completed, login!', ToastAndroid.SHORT);
        })

      // show if the validation has failed.
        .catch((error) => {
          ToastAndroid.show(error, ToastAndroid.SHORT);
        });
    }
    // eslint-disable-next-line react/destructuring-assignment
    return ToastAndroid.show(this.state.errorMessage, ToastAndroid.SHORT);
  }

  render() {
    const {
      firstName, lastName, email, password,
    } = this.state;
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
              onChangeText={(firstName) => this.setState({ firstName })}
              value={firstName}
            />
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Last Name:</Text>
            <TextInput
              style={styles.formInput}
              onChangeText={(lastName) => this.setState({ lastName })}
              value={lastName}
            />
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

SignUp.propTypes = {
  navigation: PropTypes.shape({
    addListener: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default SignUp;
