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
  View, StyleSheet, FlatList, TouchableWithoutFeedback, TouchableOpacity,
  Text, Image, SafeAreaView, ActivityIndicator, ToastAndroid,
} from 'react-native';
// import PropTypes from 'prop-types';
import { SearchBar, List, ListItem } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';

const image = { uri: 'https://reactjs.org/logo-og.png' };

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
      limit: 2,
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
      const tokenId = await AsyncStorage.getItem('@session_token');

      // check if token exists
      if (tokenId != null) {
        // store the token
        this.setState({ token: tokenId });
        this.setState({ limit: 2 });
        this.setState({ offset: 2 });

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
    console.log(this.state.limit);

    return fetch(`http://10.0.2.2:3333/api/1.0.0/find/?q=${this.state.searchValue}&clenliness_rating=${this.state.cleanliness_rating}&price_rating=${this.state.price_rating}&quality_rating=${this.state.quality_rating}&overall_rating=${this.state.overall_rating}&limit=${this.state.limit}`,
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

  showMoreData = () => {
    this.setState({
      limit: this.state.limit + 2,
      offset: this.state.offset + 2,
    }, () => this.updateSearch(this.state.search));
  }

  locationDetails = async ({ item }) => {
    console.log('clicked');
    await AsyncStorage.setItem('@location_id', item.location_id.toString());
    this.props.navigation.navigate('locationReviews');
  }

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
      </View>
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
    return (
      <SafeAreaView style={styles.mainBg}>
        <FlatList
          data={this.state.locationData.sort((a, b) => a.location_name.localeCompare(b.location_name))}
          keyExtractor={(item, index) => item.location_id.toString()}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback onPress={() => this.locationDetails({ item })}>
              <View style={styles.rowFront}>
                <View style={styles.row}>
                  <Image
                    style={{ width: 78, height: 123 }}
                    source={{ uri: item.photo_path }}
                  />
                  <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Text style={styles.reviewHeader}>
                      {item.location_name}
                      {', '}
                      {' '}
                      {item.location_town}
                    </Text>
                    <Text style={styles.reviewInfo}>
                      Overall:
                      {item.avg_overall_rating}
                      {' | '}
                      Quality:
                      {' '}
                      {item.avg_quality_rating}
                      {' | '}
                      Price:
                      {item.avg_price_rating}
                      {' | '}
                      Hygeine:
                      {' '}
                      {item.avg_clenliness_rating}
                    </Text>
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
  flatListStyle: {
    height: 80,
    paddingTop: 20,
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
    lineHeight: 25,

  },
  reviewInfo: {
    fontSize: 15,
    color: 'grey',
    flexShrink: 1,
    lineHeight: 30,
    paddingLeft: 10,
    paddingTop: 2,

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

});

export default SearchScreen;
