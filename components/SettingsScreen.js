/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-shadow */
import React, { Component } from 'react';
import {
  Text, TextInput, View, ActivityIndicator, ScrollView, TouchableOpacity, ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import styles from '../Styles/styles';
import { checkAllFields } from './Utils';

class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      userId: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      origEmail: '',
      origFirstName: '',
      origLastName: '',
      isLoading: true,
      passwordCheck: true,
      errorMessage: 'Fields must not be left blank',
      emailCheck: true,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.getFields();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getFields = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const userId = await AsyncStorage.getItem('@user_id');
    const { navigation } = this.props;
    this.setState({ token, userId });

    // navigate to settings page
    navigation.navigate('settings');

    // get the data to display on page
    this.getData();
  }

  getData = () => {
    const { userId, token } = this.state;
    const { navigation } = this.props;
    return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${userId}`,
      {
        headers: {
          'X-Authorization': token,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
      })
      .then(async (responseJson) => {
        this.setState({ origEmail: responseJson.email });
        this.setState({ origFirstName: responseJson.first_name });
        this.setState({ origLastName: responseJson.last_name });
        this.setState({ email: responseJson.email });
        this.setState({ firstName: responseJson.first_name });
        this.setState({
          lastName: responseJson.last_name,
          isLoading: false,
        });

        navigation.navigate('main');
      })

      .catch(() => {
        ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
      });
  }

  logout = async () => {
    const { token } = this.state;
    const { navigation } = this.props;
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/logout', {
      method: 'POST',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ token: '' });
          navigation.navigate('home');
          AsyncStorage.removeItem('@session_token');
        }
      })
      .catch(() => {
        ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
      });
  }

  // call to update user
  async updateUser() {
    const toSend = {};
    const {
      email, origEmail, firstName, origFirstName, lastName, origLastName, userId,
      password, confirmPassword, token,
    } = this.state;

    // validate email with regex
    if (email !== origEmail) {
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
      toSend.email = email;
    }

    if (firstName !== origFirstName) {
      toSend.first_name = firstName;
    }

    if (lastName !== origLastName) {
      toSend.last_name = lastName;
    }

    // validations for password
    if (password !== '') {
      if (password.length <= 6) {
        this.state.passwordCheck = false;
        this.state.errorMessage = 'Password must be greater than 6 characters!';
      } else if (password !== confirmPassword) {
        this.state.passwordCheck = false;
        this.state.errorMessage = 'Passwords do not match!';
      } else {
        this.state.passwordCheck = true;
        this.state.errorMessage = 'Fields must not be left blank!';
        toSend.password = password;
      }
    }

    // check to see all changes contain values
    if (checkAllFields(toSend) && this.state.passwordCheck && this.state.emailCheck) {
      // send PATCH request to api
      try {
        const response = await fetch(`http://10.0.2.2:3333/api/1.0.0/user/${userId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'X-Authorization': token,
            },
            body: JSON.stringify(toSend),
          });
        // check the response status we get back
        if (response.status === 200) {
          ToastAndroid.show('Details updated', ToastAndroid.SHORT);
        }
      } catch (error) {
        ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show(this.state.errorMessage, ToastAndroid.SHORT);
    }
  }

  render() {
    const {
      isLoading, firstName, lastName, email, password, confirmPassword,
    } = this.state;
    if (isLoading) {
      return (
        <View style={styles.mainBg}>
          <ActivityIndicator
            size="large"
            color="#00ff00"
            style={{ alignSelf: 'center' }}
          />
        </View>
      );
    }
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
              onChangeText={(password) => this.setState({ password })}
              value={password}
              minLength={5}
              secureTextEntry
            />
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Confirm Password:</Text>
            <TextInput
              style={styles.formInput}
              onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
              value={confirmPassword}
              minLength={6}
              secureTextEntry
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

SettingsScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

export default SettingsScreen;
