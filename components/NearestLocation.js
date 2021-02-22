/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-var */
/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-use-before-define */
/* eslint-disable react/sort-comp */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-else-return */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import {
  Text, View, StyleSheet, Animated, TouchableOpacity, Button, TouchableWithoutFeedback, FlatList, Image, ActivityIndicator, ToastAndroid, Alert, PermissionsAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { SearchBar } from 'react-native-elements';
import { getDistance, orderByDistance } from 'geolib';
import SwipeUpDownModal from 'react-native-swipe-modal-up-down';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import SwipeUpDown from 'react-native-swipe-up-down';
import Geocoder from 'react-native-geocoding';

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
      distances: [],
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.findCoordinates();
      Geocoder.init('AIzaSyBh2ylrKj-iK_RnzauzTMGUIsNta92IRRs'); // use a valid API key
    });
  }

  findCoordinates() {
    // console.log('state', this.state);
    if (!this.state.locationPermission) {
      // console.log('asking for permission...');
      this.state.locationPermission = requestLocationPermission();
    }
    Geolocation.getCurrentPosition((position) => {
      this.setState({
        location: {
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
          // longitude: -2.242631,
          // latitude: 53.480759,
        },
      });
      this.getAllLocations();
    }, (error) => {
      Alert.alert(error.message);
    }, {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000,
    });
  }

  orderDistance(lat, lon, locationData) {
    console.log(locationData);
    console.log('>>>>>CALCULATING');
    // eslint-disable-next-line vars-on-top
    var distanceVal = 0;
    this.state.distances = [];
    for (let i = 0; i < locationData.length; i++) {
      distanceVal = getDistance({ latitude: lat, longitude: lon },
        { latitude: locationData[i].latitude, longitude: locationData[i].longitude });
      this.state.distances.push({
        location_id: locationData[i].location_id,
        location_name: locationData[i].location_name,
        avg_overall_rating: locationData[i].avg_overall_rating,
        longitude: locationData[i].longitude,
        latitude: locationData[i].latitude,
        distance: (distanceVal * 0.000621371192).toFixed(1),
        photo_path: locationData[i].photo_path,
      });
    }
    console.log('ordering....');
    this.state.distances = this.state.distances.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    console.log(this.state.distances);
    this.setState({
      isLoading: false,
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
        // console.log(responseJson);
        this.orderDistance(this.state.location.latitude, this.state.location.longitude, responseJson);
      })
      .catch((error) => {
        // console.error(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  };

  findClosestOnes(data) {
    console.log(data);
    this.setState({
      isLoading: true,
    });
    Geocoder.from(data.description)
      .then((json) => {
        var { location } = json.results[0].geometry;
        this.setState({
          isLoading: true,
          location: {
            longitude: location.lng,
            latitude: location.lat,
          },
        });
        this.orderDistance(location.lat, location.lng, this.state.distances);
      })
      .catch((error) => console.warn(error));
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
      console.log(`location 2 :${this.state.location}`);
      return (
        <View style={{ flex: 5 }}>
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
            this.state.distances.map((marker) => (
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
          <Animated.ScrollView horizontal scrollEventThrottle={1} style={styles.overlay}>
            {
            this.state.distances.map((marker, index) => (
              <View key={marker.location_id} style={styles.card}>
                <Image source={{ uri: marker.photo_path }} style={styles.cardImage} />
                <View style={styles.textContent}>
                  <Text numberOfLines={1} style={styles.cardtitle}> {marker.location_name}</Text>
                  <Text numberOfLines={1} style={styles.carddescription}> {marker.avg_overall_rating}</Text>
                  <Text numberOfLines={1} style={styles.carddescription}> {marker.distance} mi </Text>

                </View>
              </View>
            ))
          }
          </Animated.ScrollView>

          <Text style={styles.searchBar} onPress={() => this.swipeUpDownRef.showFull()}>Search for coffee locations</Text>

          <SwipeUpDown
            onPress={() => this.onShowMini()}
            itemFull={
              <GooglePlacesAutocomplete
                placeholder="Search"
                query={{
                  key: 'AIzaSyBh2ylrKj-iK_RnzauzTMGUIsNta92IRRs',
                  language: 'en', // language of the results
                  components: 'country:uk', // language of the results
                }}
                onPress={(data, details = null) => this.findClosestOnes(data)}
                onFail={(error) => console.error(error)}
                requestUrl={{
                  url:
                      'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api',
                  useOnPlatform: 'web',
                }}
              />
            } // Pass props component when show full
            hasRef={(ref) => (this.swipeUpDownRef = ref)}
            onShowFull={() => console.log('full')}
            style={{ height: 20, backgroundColor: 'lightgrey' }}
          />
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
  mainBg: {
    backgroundColor: '#001624',
    flex: 1,
  },
  reviewInfo: {
    fontSize: 15,
    color: 'black',
    flexShrink: 1,
    lineHeight: 30,
    paddingLeft: 10,
    paddingTop: 2,

  },
  overlay: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: 'transparent',
  },
  containerHeader: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    backgroundColor: 'blue',
  },
  headerContent: {
    marginTop: 0,
    backgroundColor: 'grey',
  },
  Modal: {
    backgroundColor: 'grey',
    marginTop: 100,
  },
  searchBar: {
    backgroundColor: 'grey',
    borderRadius: 3,
    borderTopStartRadius: 4,
    textAlign: 'center',

  },
  card: {
    // padding: 10,
    elevation: 2,
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: 150,
    width: 200,
    marginLeft: 20,
    overflow: 'hidden',
    borderRadius:20,
  },
  cardImage: {
    flex: 3,
    width: 100,
    marginTop:20,
    height: 30,
    alignSelf: 'center',
  },
  cardtitle: {
    fontSize: 15,
    // marginTop: 5,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 15,
    color: '#444',
  },
});

export default NearestLocation;
