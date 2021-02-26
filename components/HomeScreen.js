/* eslint-disable react/prop-types */
/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import {
  Text, View, StyleSheet, Image, TouchableOpacity,
} from 'react-native';

// eslint-disable-next-line react/prefer-stateless-function
class HomeScreen extends Component {
  render() {
    const { navigation } = this.props;
    return (
      <View style={homeScreenStyle.mainBg}>

        <View>
          <Text style={homeScreenStyle.title}>Welcome to Coffida</Text>
          <Image
            style={{
              width: 180, height: 200, marginTop: 85, marginLeft: 60,
            }}
            source={{ uri: 'http://clipart-library.com/img/1695725.png' }}
          />
        </View>

        <View>
          <View style={homeScreenStyle.buttonView}>
            <TouchableOpacity
              style={homeScreenStyle.greenButton}
              onPress={() => navigation.navigate('signup')}
              accessible
              accessibilityLabel="sign up!"
              accessibilityHint="When you tap this button, you will be taken to the sign up screen where you will be able to create an account!"
            >
              <Text style={homeScreenStyle.buttonText}>SIGN UP</Text>
            </TouchableOpacity>
          </View>

          <View style={homeScreenStyle.buttonView2}>
            <TouchableOpacity
              accessible
              accessibilityLabel="Login!"
              accessibilityHint="When you tap this button, you will be taken to the login screen to enter your email and password!"
              style={homeScreenStyle.buttonNoBg}
              onPress={() => navigation.navigate('login')}
            >
              <Text style={homeScreenStyle.buttonText2}>LOGIN</Text>
            </TouchableOpacity>
          </View>

        </View>

      </View>
    );
  }
}

const homeScreenStyle = StyleSheet.create({

  mainBg: {
    backgroundColor: '#001624',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  buttonView: {
    backgroundColor: '#00ffea',
    borderRadius: 3,
  },
  buttonView2: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#00ffea',
    marginTop: 10,
  },
  greenButton: {
    padding: 15,
    alignSelf: 'center',
  },
  buttonNoBg: {
    padding: 15,
    width: 290,
    alignSelf: 'center',
    paddingLeft: 119,
  },
  title: {
    color: 'white',
    fontSize: 30,
    paddingLeft: 15,
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  buttonText2: {
    color: '#00ffea',
    fontSize: 18,
  },

});

export default HomeScreen;
