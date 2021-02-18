/* eslint-disable no-undef */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import {
  Text, View, Alert, StyleSheet, Button, Image, TouchableOpacity, PermissionsAndroid,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

// eslint-disable-next-line react/prefer-stateless-function
class NearestLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      locationPermission: false,

    };
  }

  componentDidMount() {
    this.findCoordinates();
  }

  requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This app requires access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can access location');
        return true;
      }
      console.log('Location permission denied');
      return false;
    } catch (err) {
      console.warn(err);
    }
  }

  findCoordinates = () => {
    // console.log('finding co-rodinates...');
    if (!this.state.locationPermission) {
      this.state.locationPermission = this.requestLocationPermission();
    }
    Geolocation.getCurrentPosition((position) => {
      const location = JSON.stringify(position);
      this.setState({ location });
    }, (error) => {
      Alert.alert(error.message);
    }, {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000,
    });
  }

  render() {
    return (
      <View style={styles.mainBg}>

        <View>
          <Text>
            {' '}
            Location..
            {this.state.location}
          </Text>
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

export default NearestLocation;
