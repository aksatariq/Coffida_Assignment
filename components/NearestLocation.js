import React, { Component } from 'react';
import {
  Text, View, StyleSheet, Animated, Image,
  ActivityIndicator, ToastAndroid, Alert, PermissionsAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { getDistance } from 'geolib';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import SwipeUpDown from 'react-native-swipe-up-down';
import Geocoder from 'react-native-geocoding';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  textContent: {
    width: 200,
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
  searchBar: {
    backgroundColor: '#696969',
    textAlign: 'center',
    fontSize: 15,

  },
  card: {
    elevation: 2,
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: 150,
    width: 220,
    marginLeft: 20,
    overflow: 'hidden',
    borderRadius: 5,
  },
  cardImage: {
    flex: 3,
    width: 80,
    marginTop: 20,
    height: 30,
    alignSelf: 'center',
  },
  cardtitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#444',
    paddingTop: 5,
  },
  cardDescription: {
    fontSize: 15,
    color: '#444',
  },
});

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
      return true;
    }
    return false;
  } catch (err) {
    ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
  }
  return ToastAndroid.show('Permissions', ToastAndroid.SHORT);
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
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.findCoordinates();
      Geocoder.init('AIzaSyBh2ylrKj-iK_RnzauzTMGUIsNta92IRRs'); // use a valid API key
    });
  }

  getAllLocations = async () => {
    const { location } = this.state;
    const token = await AsyncStorage.getItem('@session_token');

    return fetch('http://10.0.2.2:3333/api/1.0.0/find/',
      {
        headers: { 'X-Authorization': token },
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
        this.orderDistance(location.latitude, location.longitude, responseJson);
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  };

  findCoordinates() {
    const { locationPermission } = this.state;
    if (!locationPermission) {
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
    let distanceVal = 0;
    this.state.distances = [];
    const { distances } = this.state;
    for (let i = 0; i < locationData.length; i += 1) {
      distanceVal = getDistance({ latitude: lat, longitude: lon },
        { latitude: locationData[i].latitude, longitude: locationData[i].longitude });
      distances.push({
        location_id: locationData[i].location_id,
        location_name: locationData[i].location_name,
        avg_overall_rating: locationData[i].avg_overall_rating,
        longitude: locationData[i].longitude,
        latitude: locationData[i].latitude,
        distance: (distanceVal * 0.000621371192).toFixed(1),
        photo_path: locationData[i].photo_path,
      });
    }
    this.state.distances = distances.sort(
      (a, b) => parseFloat(a.distance) - parseFloat(b.distance),
    );
    this.setState({
      isLoading: false,
    });
  }

  findClosestOnes(data) {
    const { distances } = this.state;
    this.setState({
      isLoading: true,
    });
    Geocoder.from(data.description)
      .then((json) => {
        const { location } = json.results[0].geometry;
        this.setState({
          isLoading: true,
          location: {
            longitude: location.lng,
            latitude: location.lat,
          },
        });
        this.orderDistance(location.lat, location.lng, distances);
      })
      .catch(() => ToastAndroid.show('Something went wrong', ToastAndroid.SHORT));
  }

  render() {
    const { isLoading, location, distances } = this.state;
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
      <View style={{ flex: 5 }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.10,
            longitudeDelta: 0.10,
          }}
        >
          <Marker
            coordinate={location}
            title="My location"
            description="Your location"
          />
          {
            distances.map((marker) => (
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
            distances.map((marker) => (
              <View key={marker.location_id} style={styles.card}>
                <Image source={{ uri: marker.photo_path }} style={styles.cardImage} />
                <View style={styles.textContent}>
                  <Text numberOfLines={1} style={styles.cardtitle}>
                    {' '}
                    {marker.location_name}
                  </Text>
                  <Text numberOfLines={1} style={styles.carddescription}>
                    {' '}
                    {marker.avg_overall_rating}
                  </Text>
                  <Text numberOfLines={1} style={styles.carddescription}>
                    {' '}
                    {marker.distance}
                    {' '}
                    mi
                    {' '}
                  </Text>

                </View>
              </View>
            ))
          }
        </Animated.ScrollView>

        <Text
          style={styles.searchBar}
          onPress={() => this.swipeUpDownRef.showFull()}
        >
          Search for coffee locations
        </Text>

        <SwipeUpDown
          onPress={() => this.onShowMini()}
          itemFull={(
            <GooglePlacesAutocomplete
              placeholder="Search"
              query={{
                key: 'AIzaSyBh2ylrKj-iK_RnzauzTMGUIsNta92IRRs',
                language: 'en', // language of the results
                components: 'country:uk', // language of the results
              }}
              onPress={(data = null) => this.findClosestOnes(data)}
              onFail={() => ToastAndroid.show('Something went wrong', ToastAndroid.SHORT)}
              requestUrl={{
                url:
                      'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api',
                useOnPlatform: 'web',
              }}
            />
            )} // Pass props component when show full
          // eslint-disable-next-line no-return-assign
          hasRef={(ref) => (this.swipeUpDownRef = ref)}
          style={{ height: 20, backgroundColor: '#696969', opacity: 0.9 }}
        />
      </View>
    );
  }
}

NearestLocation.propTypes = {
  navigation: PropTypes.shape({
    addListener: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default NearestLocation;
