/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* eslint-disable no-else-return */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import {
  View, StyleSheet, FlatList, Text, Image, ToastAndroid, TouchableWithoutFeedback,
} from 'react-native';
// import PropTypes from 'prop-types';
import { SearchBar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';

// eslint-disable-next-line react/prefer-stateless-function
class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      search: '',
      locationData: [],
      token: '',
      searchValue: '',
      overall_rating: '',
      price_rating: '',
      quality_rating: '',
      clenliness_rating: '',
      cleanliness_rating: '',
      search_in: '',
      limit: '',
      offset: '',
      location_id: '',
      location_name: '',
      location_town: '',
      location_photopath: '',
      location_latitude: '',
      location_longitude: '',

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
      const tokenId = await AsyncStorage.getItem('@session_token');

      // check if token exists
      if (tokenId != null) {
        // store the token
        this.setState({ token: tokenId });

        // call to display all locations
        this.updateSearch('');
      }
    }

  updateSearch = (text) => {
    this.setState({
      search: text,
    });
    console.log('searching.22222...');

    console.log(this.state.overall_rating);
    console.log(this.state.cleanliness_rating);

    // const navigation = this.props.navigation;
    console.log('searching....');
    console.log(text);

    return fetch(`http://10.0.2.2:3333/api/1.0.0/find/?q=${this.state.searchValue}&clenliness_rating=${this.state.cleanliness_rating}&price_rating=${this.state.price_rating}&quality_rating=${this.state.quality_rating}&overall_rating=${this.state.overall_rating}`,
      {
        headers: { 'X-Authorization': this.state.token },
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
          isLoading: true,
        });
      })

      .catch((error) => {
        // console.error(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  };

  locationDetails({ item }) {
    console.log('clicked');
    this.props.navigation.navigate('locationDetails',
      {
        locationId: item.location_id,
      });
  }

  // eslint-disable-next-line consistent-return
  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.mainBg}>
          <View>
            <SearchBar
              round
              inputStyle={{ backgroundColor: '#001624' }}
              containerStyle={{ backgroundColor: '#001624' }}
              placeholderTextColor="grey"
              searchIcon={{ size: 24 }}
              onChangeText={(searchValue) => this.setState({
                searchValue,
              }, this.updateSearch)}
              onClear={(text) => this.updateSearch('')}
              placeholder="Search for a location..."
              value={this.state.searchValue}
            />
          </View>
          <View style={styles.sortView}>
            <Text style={styles.sortFilters}> Sort:</Text>
            <TextInput
              style={styles.filterText}
              placeholder="Overall"
              placeholderTextColor="white"
              // eslint-disable-next-line camelcase
              onChangeText={(overall_rating) => this.setState({
                overall_rating,
              }, this.updateSearch)}
            />
            <TextInput
              style={styles.filterText}
              placeholder="Price"
              placeholderTextColor="white"
              onChangeText={(price_rating) => this.setState({
                price_rating,
              }, this.updateSearch)}
            />
            <TextInput
              style={styles.filterText}
              placeholder="Cleanliness"
              placeholderTextColor="white"
              onChangeText={(cleanliness_rating) => this.setState({
                cleanliness_rating,
              }, this.updateSearch)}
            />
            <TextInput
              style={styles.filterText}
              placeholder="Quality"
              placeholderTextColor="white"
              onChangeText={(quality_rating) => this.setState({
                quality_rating,
              }, this.updateSearch)}
            />
          </View>
          <View>
            <FlatList
              data={this.state.locationData}
              keyExtractor={(item, index) => item.location_id.toString()}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback onPress={() => this.locationDetails({ item })}>
                  <View>
                    <Text style={styles.formText}>{item.location_name}</Text>
                    <Text style={styles.formText}>{item.location_town}</Text>
                    <Image
                      style={{ width: 200, height: 200 }}
                      source={{ uri: item.location_photopath }}
                    />
                  </View>
                </TouchableWithoutFeedback>
              )}
            />
          </View>
        </View>
      );
    }
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
  },
  sortFilters: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  searchBar: {
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: '#001624',
  },
  formText: {
    fontSize: 15,
    color: 'white',
  },
  filterText: {
    fontSize: 14,
    color: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00ffea',
    width: 83,
    height: 27,
    marginLeft: 7,
    padding: 2,
    textAlign: 'center',
  },
  sortView: {
    flexDirection: 'row',
    marginTop: 10,
  },

});

export default SearchScreen;
