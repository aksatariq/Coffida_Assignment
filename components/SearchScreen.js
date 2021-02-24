/* eslint-disable react/jsx-first-prop-new-line */
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
  View, StyleSheet, Animated, FlatList, TouchableWithoutFeedback, TouchableOpacity,
  Text, Image, SafeAreaView, ActivityIndicator, ToastAndroid,
} from 'react-native';
// import PropTypes from 'prop-types';
import { SearchBar, List, ListItem } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import { AirbnbRating } from 'react-native-ratings';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const image = { uri: 'https://reactjs.org/logo-og.png' };
const searchFilter = [
  {
    label: 'reviews',
    value: 'reviews',
  },
  {
    label: 'favourites',
    value: 'favourites',
  },
];

// eslint-disable-next-line react/prefer-stateless-function
class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      search: '',
      locationData: [],
      userFavourited: [],
      token: '',
      userId: 0,
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
      limit: 2,
      showFavourite: true,
      offset: 2,

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
      this.getUserData();
      const tokenId = await AsyncStorage.getItem('@session_token');

      // check if token exists
      if (tokenId != null) {
        // store the token
        this.setState({ token: tokenId });
        this.setState({ limit: 2 });
        this.setState({ offset: 2 });
        const userId = await AsyncStorage.getItem('@user_id');
        this.setState({ userId });

        // call to display all locations
        this.updateSearch('');
      }
    }

  updateSearch = (text) => {
    this.setState({
      search: text,
    });
    console.log('searching.22222...');

    console.log(this.state.search_in);

    // const navigation = this.props.navigation;
    console.log('searching....');
    console.log(text);
    console.log(this.state.limit);

    return fetch(`http://10.0.2.2:3333/api/1.0.0/find/?q=${this.state.searchValue}&clenliness_rating=${this.state.cleanliness_rating}&price_rating=${this.state.price_rating}&quality_rating=${this.state.quality_rating}&overall_rating=${this.state.overall_rating}&limit=${this.state.limit}&search_in=${this.state.search_in}`,
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
          isLoading: false,
        });
      })

      .catch((error) => {
        // console.error(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  };

  showMoreData = () => {
    this.setState({
      limit: this.state.limit + 2,
      offset: this.state.offset + 2,
    }, () => this.updateSearch(this.state.search));
  }

  locationDetails = async ({ item }) => {
    console.log('clicked');
    await AsyncStorage.setItem('@location_id', item.location_id.toString());
    await AsyncStorage.setItem('@location_name', item.location_name);
    await AsyncStorage.setItem('@location_town', item.location_town);
    this.props.navigation.navigate('locationReviews');
  }

  getUserData = () => fetch(`http://10.0.2.2:3333/api/1.0.0/user/${this.state.userId}`,
    {
      headers: {
        'X-Authorization': this.state.token,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } if (response.status === '400') {
        throw new Error('Invalid Email or Password!');
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then(async (responseJson) => {
      this.setState({
        userFavourited: responseJson.favourite_locations,
      });
    })

    checkIfFavourite = (locationId) => {
      console.log(locationId);
      this.state.showFavourite = false;
      for (let i = 0; i < this.state.userFavourited.length; i++) {
        if (this.state.userFavourited[i].location_id === locationId) {
          this.state.showFavourite = true;
          console.log('matchedLike');
        }
      }
      // this.updateSearch(' ');
    }

  addToFavourite = (locationId) => fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}/favourite`,
    {
      method: 'POST',
      headers: { 'X-Authorization': this.state.token },
    })
    .then((response) => {
      if (!response.ok) {
        // get error message from body or default to response status
        console.log('error');
      }
      this.getUserData();
      this.updateSearch(this.state.search);
    })
    .catch((error) => {
      console.error('There was an error!', error);
    })

    removeFromFavourite = (locationId) => fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}/favourite`,
      {
        method: 'DELETE',
        headers: { 'X-Authorization': this.state.token },
      })
      .then((response) => {
        if (!response.ok) {
          // get error message from body or default to response status
          console.log('error');
        }
        console.log('sedning 23to udat');
        this.getUserData();
        this.updateSearch(this.state.search);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      })

  renderHeader = () => (
    <View>
      <SearchBar
        round
        inputContainerStyle={{ backgroundColor: '#001624' }}
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

      <Animated.ScrollView horizontal scrollEventThrottle={1} style={{ height: 50 }}>
        <View style={styles.sortView}>
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
            placeholder="Hygeine"
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
          <RNPickerSelect
            onValueChange={(search_in) => this.setState({
              search_in,
            }, this.updateSearch)}
            useNativeAndroidPickerStyle={false}
            placeholder={{ label: 'Select', value: '' }}
            style={{
              inputAndroid: {
                color: 'white',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#00ffea',
                width: 78,
                height: 25,
                marginLeft: 8,
                padding: 2,
                textAlign: 'center',
              },
            }}
            items={[
              { label: 'Reviewed', value: 'reviewed' },
              { label: 'Favourites', value: 'favourite' },
            ]}
          />
        </View>
      </Animated.ScrollView>
    </View>
  )

  renderFooter = () => (
    <View>
      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={() => this.showMoreData()}
      >
        <Text style={styles.buttonText}>SHOW MORE</Text>
      </TouchableOpacity>
    </View>
  )

  // eslint-disable-next-line consistent-return
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
      return (
        <SafeAreaView style={styles.mainBg}>
          <FlatList
            data={this.state.locationData.sort((a, b) => a.location_id.toString().localeCompare(b.location_id.toString()))}
            keyExtractor={(item, index) => item.location_id.toString()}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback onPress={() => this.locationDetails({ item })}>
                <View style={styles.rowFront}>
                  {
                    this.checkIfFavourite(item.location_id)
                  }
                  <View style={styles.row}>
                    <Image
                      style={{ width: 66, height: 77 }}
                      source={{ uri: item.photo_path }}
                    />
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                      <Text style={styles.reviewHeader}>
                        {item.location_name}
                        {', '}
                        {' '}
                        {item.location_town}
                      </Text>

                      <View style={{ flex: 1, flexDirection: 'row' }}>

                        <Text style={styles.reviewInfo}>
                          Overall:
                        </Text>
                        <View style={{ marginTop: 10 }}>
                          <AirbnbRating
                            count={5}
                            defaultRating={item.avg_overall_rating}
                            size={15}
                            showRating={false}
                          />
                        </View>
                        <View>
                          {this.state.showFavourite && (
                          <TouchableOpacity
                            style={{
                              alignSelf: 'center',
                              borderRadius: 5,
                              borderWidth: 1,
                              borderColor: '#00ffea',
                              flexDirection: 'row',
                              width: 70,
                              height: 35,
                              marginLeft: 50,
                              marginTop: 35,
                            }}
                            onPress={() => this.removeFromFavourite(item.location_id)}
                          >
                            <MaterialCommunityIcons
                              name="heart-plus"
                              style={styles.likeIcon}
                              color="#00ffea"
                              size={19}
                            />
                          </TouchableOpacity>

                          )}
                          {!this.state.showFavourite && (
                          <TouchableOpacity
                            style={{
                              alignSelf: 'center',
                              borderRadius: 5,
                              borderWidth: 1,
                              borderColor: '#00ffea',
                              flexDirection: 'row',
                              width: 70,
                              height: 35,
                              marginLeft: 50,
                              marginTop: 35,
                            }}
                            onPress={() => this.addToFavourite(item.location_id)}
                          >
                            <MaterialCommunityIcons
                              name="heart-off"
                              style={styles.likeIcon}
                              color="#00ffea"
                              size={19}
                            />
                          </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )}
            ListFooterComponent={this.renderFooter()}
            ListHeaderComponent={this.renderHeader()}
          />
        </SafeAreaView>
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

  buttonStyle: {
    borderRadius: 3,
    backgroundColor: '#00ffea',
    width: 100,
    color: 'white',
    margin: 18,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    height: 30,
    paddingTop: 5,
  },
  sortFilters: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 16,
  },
  searchBar: {
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: '#001624',
  },
  formText: {
    fontSize: 16,
    color: 'white',
    flexShrink: 1,
    lineHeight: 27,
  },
  filterText: {
    fontSize: 13,
    color: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00ffea',
    width: 78,
    height: 25,
    marginLeft: 8,
    padding: 2,
    textAlign: 'center',
  },
  sortView: {
    flexDirection: 'row',
    marginTop: 10,
  },
  reviewHeader: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'white',
    paddingLeft: 10,

  },
  reviewInfo: {
    fontSize: 15,
    color: 'grey',
    flexShrink: 1,
    lineHeight: 30,
    paddingLeft: 10,
    paddingTop: 6,
    width: 70,

  },
  row: {
    flex: 1,
    paddingVertical: 25,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  flatListTitle: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    flexShrink: 1,
    fontWeight: 'bold',
    marginBottom: 35,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'white',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  likeIcon: {

    color: '#00ffea',
    width: 50,
    height: 50,
    paddingTop: 15,
    alignSelf: 'center',
    overflow: 'hidden',
    paddingLeft: 25,
  },

});

export default SearchScreen;
