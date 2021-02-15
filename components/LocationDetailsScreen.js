/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-else-return */
import React, { Component } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity, ToastAndroid, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({

  mainBg: {
    backgroundColor: '#001624',
    flex: 1,
    flexDirection: 'column',
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
  },

});

class LocationDetailsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      locationData: [],
      token: '',
      location_id: 0,

    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedin();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

    checkLoggedin = async () => {
      const token = await AsyncStorage.getItem('@session_token');
      this.setState({ token });

      if (token == null) {
        this.props.navigation.navigate('home');
      }
      console.log('item received');
      const idCheck = this.props.route.params.locationId;
      this.setState({ location_id: idCheck });

      this.getData();
    }

    getData = () => {
      console.log('arrived');
      console.log(this.state.location_id);
      console.log(this.state.token);

      return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${this.state.location_id}`)
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
            isLoading: true,
          });
        })

        .catch((error) => {
        // console.error(error);
          ToastAndroid.show(error, ToastAndroid.SHORT);
        });
    };

    addToFavourite = () => {
      console.log('favourite');
      return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${this.state.location_id}/favourite`,
        {
          method: 'POST',
          headers: { 'X-Authorization': this.state.token },
        })
        .then((response) => {
          if (response.status === 200) {
            console.log('ok');
          } if (response.status === '400') {
            throw new Error('Bad request!');
          } else {
            throw new Error('Something went wrong');
          }
        })
        .catch((error) => {
        // console.error(error);
          ToastAndroid.show(error, ToastAndroid.SHORT);
        });
    }

    render() {
      if (this.state.isLoading) {
        return (
          <View style={styles.mainBg}>
            <TouchableOpacity onPress={() => this.addToFavourite()}>
              <Text style={styles.formTouchText}>Add to favourite</Text>
            </TouchableOpacity>
            <Text style={styles.formTouchText}>{this.state.locationData.location_name}</Text>
            <Text style={styles.formTouchText}>{this.state.locationData.location_town}</Text>
          </View>
        );
      } else {
        return (
          <View style={styles.mainBg}>
            <ActivityIndicator
              size="large"
              color="#00ff00"
            />
          </View>
        );
      }
    }
}

export default LocationDetailsScreen;
