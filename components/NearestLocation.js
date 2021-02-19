/* eslint-disable react/sort-comp */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-else-return */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import {
  Text, View, StyleSheet, ToastAndroid, Alert, PermissionsAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { SearchBar } from 'react-native-elements';

async function requestLocationPermission() {
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
    } else {
      console.log('Location permission denied');
      return false;
    }
  } catch (err) {
    console.warn(err);
  }
}

class NearestLocation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      location: null,
      locationPermission: false,
      isLoading: true,
      locationData: [],
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getAllLocations();
      this.findCoordinates();
    });
  }

  findCoordinates() {
    console.log('state', this.state);
    if (!this.state.locationPermission) {
      console.log('asking for permission...');
      this.state.locationPermission = requestLocationPermission();
    }
    Geolocation.getCurrentPosition((position) => {
      // const _location = JSON.stringify(position);
      const _location = position;
      console.log(_location);
      this.setState({
        location: {
          // longitude: _location.coords.longitude,
          // latitude: _location.coords.latitude,
          longitude: -2.242631,
          latitude: 53.480759,
        },
        isLoading: false,
      });
    }, (error) => {
      Alert.alert(error.message);
    }, {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000,
    });
  }

  getAllLocations = () => {
    console.log('searching.22222...');

    return fetch('http://10.0.2.2:3333/api/1.0.0/find/',
      {
        headers: { 'X-Authorization': '2d0081d796de142002b5c9eab7ebb34b' },
      })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === '400') {
          throw new Error('Bad request!');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then(async (responseJson) => {
        console.log(responseJson);
        this.setState({
          locationData: responseJson,
        });
      })

      .catch((error) => {
        // console.error(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    } else {
      console.log('LOCATION 2: ', this.state.location);
      return (
        <View style={{ flex: 1 }}>
          <SearchBar
            round
            inputContainerStyle={{ backgroundColor: 'transparent' }}
            containerStyle={{ flexDirection: 'column', backgroundColor: 'transparent' }}
            placeholderTextColor="grey"
            searchIcon={{ size: 24 }}
            onChangeText={(searchValue) => this.setState({
              searchValue,
            }, this.updateSearch)}
            onClear={(text) => this.updateSearch('')}
            placeholder="Search for a location..."
            value={this.state.searchValue}
          />

          <MapView
            provider={PROVIDER_GOOGLE}
            style={{ flex: 1 }}
            region={{
              latitude: this.state.location.latitude,
              longitude: this.state.location.longitude,
              latitudeDelta: 0.10,
              longitudeDelta: 0.10,
            }}
          >
            <Marker
              coordinate={this.state.location}
              title="My location"
              description="Your location"
            />
            {
            this.state.locationData.map((marker) => (
              <Marker
                key={marker.location_id}
                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              >
                <Callout>
                  <Text>{marker.location_name}</Text>
                </Callout>
              </Marker>
            ))
          }
          </MapView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
});

export default NearestLocation;
