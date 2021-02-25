/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity, Image,
  ToastAndroid, ActivityIndicator, FlatList, TouchableHighlight,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AirbnbRating } from 'react-native-ratings';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({

  mainBg: {
    backgroundColor: '#001624',
    flex: 1,
    flexDirection: 'column',
  },
  reviewText: {
    fontSize: 15,
    color: 'grey',
    flexShrink: 1,
    paddingBottom: 15,
    width: 100,
  },
  reviewTextInput: {
    fontSize: 15,
    color: 'grey',
    paddingBottom: 15,

  },
  reviewHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
    marginTop: 25,
    marginBottom: 10,
  },

  favouriteIcon: {
    color: '#00ffea',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#00ffea',
    width: 33,
    height: 33,
    padding: 7,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: -90,
    marginRight: 20,

  },
  favouriteText: {
    color: '#00ffea',
    fontSize: 14,
    alignSelf: 'center',
    marginRight: 10,
  },
  starRating: {
    paddingVertical: -100,
  },

  likeIcon: {

    color: '#00ffea',
    width: 40,
    height: 40,
    padding: 10,
    alignSelf: 'center',
    overflow: 'hidden',
  },

});

class LocationDetailsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      locationData: [],
      locationReviews: [],
      userLiked: [],
      userId: '',
      token: '',
      locationId: 0,
      showLike: true,

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
    const token = await AsyncStorage.getItem('@session_token');
    const userId = await AsyncStorage.getItem('@user_id');
    const locationId = await AsyncStorage.getItem('@location_id');

    this.setState({ token, userId, locationId });

    this.getUserData();
  }

  getData = async () => {
    const { locationId } = this.state;

    // get request to get locations
    return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}`)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      })
      .then(async (responseJson) => {
        this.setState({
          locationData: responseJson,
          locationReviews: responseJson.location_reviews,
          isLoading: true,
        });
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  getUserData = () => {
    const { userId, token } = this.state;

    // get user data
    return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${userId}`,
      {
        headers: {
          'X-Authorization': token,
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
          userLiked: responseJson.liked_reviews,
        });
        this.getData();
      })

      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  checkIfLiked = (reviewId) => {
    const { userLiked } = this.state;
    this.state.showLike = false;
    for (let i = 0; i < userLiked.length; i += 1) {
      if (userLiked[i].review.review_id === reviewId) {
        this.state.showLike = true;
      }
    }
  }

  likeReview = ({ item }) => {
    const { locationId, token } = this.state;

    return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review/${item.review_id}/like`,
      {
        method: 'POST',
        headers:
        {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
      })
      .then((response) => {
        if (!response.ok) {
          // get error message from body or default to response status
          ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
        }
        this.getUserData();
      })
      .catch(() => {
        ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      });
  }

  unlikeReview = ({ item }) => {
    const { locationId, token } = this.state;
    return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review/${item.review_id}/like`,
      {
        method: 'DELETE',
        headers:
        {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
      })
      .then((response) => {
        if (!response.ok) {
          ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
        }
        this.getUserData();
      })
      .catch(() => {
        ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      });
  }

  renderHeader = () => (
    <View style={{ padding: 10 }}>
      <Text style={styles.reviewHeader}>
        {this.state.locationData.location_name}
        {', '}
        {' '}
        {this.state.locationData.location_town}
      </Text>
      <View>
        <TouchableHighlight style={{ alignSelf: 'center' }} onPress={() => this.deletePhoto()}>
          <Image
            style={{
              width: 85,
              height: 100,
              padding: 5,
              marginLeft: 20,
              borderRadius: 60,
              marginBottom: 30,
              marginTop: 20,
            }}
            source={{ uri: this.state.locationData.photo_path }}
          />
        </TouchableHighlight>
      </View>
    </View>
  )

  render() {
    const { locationReviews, showLike, isLoading } = this.state;
    if (isLoading) {
      return (
        <View style={styles.mainBg}>
          <FlatList
            data={locationReviews}
            keyExtractor={(item) => item.review_id.toString()}
            renderItem={({ item }) => (
              <View style={{ padding: 20, marginTop: -30 }}>
                <Text style={styles.reviewTextInput}>
                  {item.review_body}
                </Text>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Text style={styles.reviewText}>
                    Overall:
                    {' '}
                  </Text>
                  <AirbnbRating
                    count={5}
                    defaultRating={item.overall_rating}
                    size={15}
                    showRating={false}
                    style={styles.starRating}
                  />
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Text style={styles.reviewText}>
                    Quality:
                    {' '}
                  </Text>
                  <AirbnbRating
                    count={5}
                    defaultRating={item.quality_rating}
                    size={15}
                    style={styles.starRating}
                    showRating={false}
                  />
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Text style={styles.reviewText}>
                    Price:
                    {' '}
                  </Text>
                  <AirbnbRating
                    count={5}
                    defaultRating={item.price_rating}
                    size={15}
                    showRating={false}
                    style={styles.starRating}
                  />
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Text style={styles.reviewText}>
                    Hygeine:
                    {' '}
                  </Text>

                  <AirbnbRating
                    count={5}
                    defaultRating={item.clenliness_rating}
                    size={15}
                    showRating={false}
                    style={styles.starRating}
                  />
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Text style={styles.reviewText}>
                    Likes:
                  </Text>
                  <Text style={styles.reviewText}>
                    {' '}
                    {item.likes}
                  </Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  {
                  this.checkIfLiked(item.review_id)
                }
                  {showLike && (
                    <TouchableOpacity
                      style={{
                        alignSelf: 'center',
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: '#00ffea',
                        flexDirection: 'row',
                        marginTop: 20,
                        width: 200,
                        marginBottom: 30,

                      }}
                      onPress={() => this.unlikeReview({ item })}
                    >
                      <MaterialCommunityIcons
                        name="thumb-up"
                        style={styles.likeIcon}
                        color="#00ffea"
                        size={19}
                      />
                      <Text style={styles.favouriteText}>
                        Unlike this review?
                      </Text>
                    </TouchableOpacity>

                  )}
                  {!showLike && (
                    <TouchableOpacity
                      style={{
                        alignSelf: 'center',
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: '#00ffea',
                        flexDirection: 'row',
                        marginTop: 20,
                        width: 200,
                        marginBottom: 30,

                      }}
                      onPress={() => this.likeReview({ item })}
                    >
                      <MaterialCommunityIcons
                        name="thumb-up-outline"
                        style={styles.likeIcon}
                        color="#00ffea"
                        size={19}
                      />
                      <Text style={styles.favouriteText}>
                        Like this review?
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
            ListHeaderComponent={this.renderHeader()}
          />
        </View>
      );
    }
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

LocationDetailsScreen.propTypes = {
  navigation: PropTypes.shape({
    addListener: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

export default LocationDetailsScreen;
