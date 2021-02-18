/* eslint-disable react/prop-types */
/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import {
  Text, View, StyleSheet, Image, TouchableOpacity,
} from 'react-native';
// import PropTypes from 'prop-types';

// eslint-disable-next-line react/prefer-stateless-function
class HomeScreen extends Component {
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.mainBg}>

        <View>
          <Text style={styles.title}>Welcome to Coffida</Text>
        </View>

        <View style={styles.buttonOrder}>
          <View style={styles.buttonView}>
            <TouchableOpacity
              style={styles.greenButton}
              onPress={() => navigation.navigate('signup')}
            >
              <Text style={styles.buttonText}>SIGN UP</Text>
            </TouchableOpacity>
          </View>
          <Image
            style={styles.tinyLogo}
            source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
          />
          <View style={styles.buttonView2}>
            <TouchableOpacity
              style={styles.buttonNoBg}
              onPress={() => navigation.navigate('login')}
            >
              <Text style={styles.buttonText2}>LOGIN</Text>
            </TouchableOpacity>
          </View>

        </View>

      </View>
    );
  }
}

// HomeScreen.propTypes = {
//   navigation: PropTypes.shape({
//     navigate: PropTypes.func.isRequired,
//   }).isRequired,
// };

const styles = StyleSheet.create({

  mainBg: {
    backgroundColor: '#001624',
    flex: 1,
    flexDirection: 'column', // can be column (default), row, row-reverse, column-reverse
    justifyContent: 'space-around', // can be flex-start (default), flex-end, center, space-between, space-around, space-evenly
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
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  buttonText2: {
    color: '#00ffea',
    fontSize: 18,
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },

});

export default HomeScreen;
