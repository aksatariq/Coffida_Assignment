import React, { Component } from 'react';
import {
  View, StyleSheet, Animated, FlatList, TouchableWithoutFeedback, TouchableOpacity,
  Text, Image, SafeAreaView, ActivityIndicator, ToastAndroid,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import { AirbnbRating } from 'react-native-ratings';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import styles from './styles';

const searchStyles = StyleSheet.create({

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
  row: {
    flex: 1,
    paddingVertical: 25,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',

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
  favIcon: {
    color: '#00ffea',
    width: 50,
    height: 50,
    paddingTop: 15,
    alignSelf: 'center',
    overflow: 'hidden',
    paddingLeft: 25,
  },

});

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
      overallRating: '',
      priceRating: '',
      qualityRating: '',
      cleanlinessRating: '',
      searchIn: '',
      limit: 4,
      showFavourite: true,
      offset: 4,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
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
        this.setState({ limit: 4 });
        this.setState({ offset: 4 });
        const userId = await AsyncStorage.getItem('@user_id');
        this.setState({ userId });

        // call to display all locations
        this.updateSearch('');
      }
    }

  updateSearch = (text) => {
    const {
      token, cleanlinessRating, priceRating, qualityRating,
      searchValue, overallRating, limit, searchIn,
    } = this.state;
    this.setState({
      search: text,
    });
    return fetch(`http://10.0.2.2:3333/api/1.0.0/find/?q=${searchValue}&clenliness_rating=${cleanlinessRating}&price_rating=${priceRating}&quality_rating=${qualityRating}&overall_rating=${overallRating}&limit=${limit}&search_in=${searchIn}`,
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
        this.setState({
          locationData: responseJson,
          isLoading: false,
        });
      })

      .catch(() => {
        ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      });
  };

  showMoreData = () => {
    const { limit, offset, search } = this.state;
    this.setState({
      limit: limit + 2,
      offset: offset + 2,
    }, () => this.updateSearch(search));
  }

  locationDetails = async ({ item }) => {
    const { navigation } = this.props;
    await AsyncStorage.setItem('@location_id', item.location_id.toString());
    await AsyncStorage.setItem('@location_name', item.location_name);
    await AsyncStorage.setItem('@location_town', item.location_town);
    navigation.navigate('locationReviews');
  }

  getUserData = () => {
    const { userId, token } = this.state;
    return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${userId}`,
      {
        headers: {
          'X-Authorization': token,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      })
      .then(async (responseJson) => {
        this.setState({
          userFavourited: responseJson.favourite_locations,
        });
      });
  }

  checkIfFavourite = (locationId) => {
    const { userFavourited } = this.state;
    this.state.showFavourite = false;
    for (let i = 0; i < userFavourited.length; i += 1) {
      if (userFavourited[i].location_id === locationId) {
        this.state.showFavourite = true;
      }
    }
  }

  addToFavourite = (locationId) => {
    const { token, search } = this.state;
    return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}/favourite`,
      {
        method: 'POST',
        headers: { 'X-Authorization': token },
      })
      .then((response) => {
        if (!response.ok) {
          ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
        }
        this.getUserData();
        this.updateSearch(search);
      })
      .catch(() => {
        ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      });
  }

   removeFromFavourite = (locationId) => {
     const { token, search } = this.state;
     return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}/favourite`,
       {
         method: 'DELETE',
         headers: { 'X-Authorization': token },
       })
       .then((response) => {
         if (!response.ok) {
           ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
         }
         this.getUserData();
         this.updateSearch(search);
       })
       .catch(() => {
         ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
       });
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
        onClear={() => this.updateSearch('')}
        placeholder="Search for a location..."
        // eslint-disable-next-line react/destructuring-assignment
        value={this.state.searchValue}
      />

      <Animated.ScrollView horizontal scrollEventThrottle={1} style={{ height: 50 }}>
        <View style={searchStyles.sortView}>
          <TextInput
            style={searchStyles.filterText}
            placeholder="Overall"
            placeholderTextColor="white"
                // eslint-disable-next-line camelcase
            onChangeText={(overallRating) => this.setState({
              overallRating,
            }, this.updateSearch)}
          />
          <TextInput
            style={searchStyles.filterText}
            placeholder="Price"
            placeholderTextColor="white"
            onChangeText={(priceRating) => this.setState({
              priceRating,
            }, this.updateSearch)}
          />
          <TextInput
            style={searchStyles.filterText}
            placeholder="Hygeine"
            placeholderTextColor="white"
            onChangeText={(cleanlinessRating) => this.setState({
              cleanlinessRating,
            }, this.updateSearch)}
          />
          <TextInput
            style={searchStyles.filterText}
            placeholder="Quality"
            placeholderTextColor="white"
            onChangeText={(qualityRating) => this.setState({
              qualityRating,
            }, this.updateSearch)}
          />
          <RNPickerSelect
            onValueChange={(searchIn) => this.setState({
              searchIn,
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
        style={styles.greenButton}
        onPress={() => this.showMoreData()}
      >
        <Text style={styles.greenButtonText}>SHOW MORE</Text>
      </TouchableOpacity>
    </View>
  )

  // eslint-disable-next-line consistent-return
  render() {
    const { isLoading, locationData, showFavourite } = this.state;
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
      <SafeAreaView style={styles.mainBg}>
        <FlatList
          data={locationData.sort(
            (a, b) => a.location_id.toString().localeCompare(b.location_id.toString()),
          )}
          keyExtractor={(item) => item.location_id.toString()}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback onPress={() => this.locationDetails({ item })}>
              <View style={searchStyles.rowFront}>
                {
                    this.checkIfFavourite(item.location_id)
                  }
                <View style={searchStyles.row}>
                  <Image
                    style={{ width: 66, height: 77 }}
                    source={{ uri: item.photo_path }}
                  />
                  <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Text style={styles.whiteBoldText}>
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
                        {showFavourite && (
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
                              name="heart-off"
                              style={searchStyles.favIcon}
                              color="#00ffea"
                              size={19}
                            />
                          </TouchableOpacity>

                        )}
                        {!showFavourite && (
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
                              name="heart-plus"
                              style={searchStyles.favIcon}
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

SearchScreen.propTypes = {
  navigation: PropTypes.shape({
    addListener: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default SearchScreen;
