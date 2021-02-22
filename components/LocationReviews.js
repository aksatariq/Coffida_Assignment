/* eslint-disable react/no-unused-state */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable radix */
/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-else-return */
import React, { Component, useState } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback,
  ToastAndroid, ActivityIndicator, FlatList, TouchableHighlight, TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AirbnbRating } from 'react-native-ratings';

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
    marginRight:20,

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
      isLoading: true,
      locationData: [],
      locationReviews: [],
      userData: [],
      userLiked: [],
      userFavourited: [],
      userId: '',
      token: '',
      locationId: 0,
      overall_rating: '',
      price_rating: '',
      quality_rating: '',
      clenliness_rating: '',
      review_body: '',
      orig_overall_rating: '',
      orig_price_rating: '',
      orig_quality_rating: '',
      orig_clenliness_rating: '',
      orig_review_body: '',
      showFavourite: true,
      showLike: true,

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
      const userId = await AsyncStorage.getItem('@user_id');
      this.setState({ userId });

      if (token == null) {
        this.props.navigation.navigate('home');
      }
      const locationId = await AsyncStorage.getItem('@location_id');
      this.setState({ locationId });

      this.getUserData();
    }

    getData = () => fetch(`http://10.0.2.2:3333/api/1.0.0/location/${this.state.locationId}`)
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
        console.log(responseJson.location_name);

        this.setState({
          locationData: responseJson,
          locationReviews: responseJson.location_reviews,
          isLoading: true,
        });
      })

      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });

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
          userLiked: responseJson.liked_reviews,
          userFavourited: responseJson.favourite_locations,
        });
        this.checkIfFavourite();
        this.getData();
      })

      .catch((error) => {
        console.error(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      })

    checkIfLiked = (reviewId) => {
      this.state.showLike = false;
      for (let i = 0; i < this.state.userLiked.length; i++) {
        if (this.state.userLiked[i].review.review_id === reviewId) {
          this.state.showLike = true;
          console.log('matchedLike');
        }
      }
    }

    checkIfFavourite = async () => {
      this.state.showFavourite = false;
      for (let i = 0; i < this.state.userFavourited.length; i++) {
        const id = parseInt(this.state.locationId);
        if (this.state.userFavourited[i].location_id === id) {
          this.state.showFavourite = true;
        }
      }
    }

    addToFavourite = () => fetch(`http://10.0.2.2:3333/api/1.0.0/location/${this.state.locationId}/favourite`,
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
      })
      .catch((error) => {
        console.error('There was an error!', error);
      })

    removeFromFavourite = () => fetch(`http://10.0.2.2:3333/api/1.0.0/location/${this.state.locationId}/favourite`,
      {
        method: 'DELETE',
        headers: { 'X-Authorization': this.state.token },
      })
      .then((response) => {
        if (!response.ok) {
          // get error message from body or default to response status
          console.log('error');
        }
        this.getUserData();
      })
      .catch((error) => {
        console.error('There was an error!', error);
      })

    likeReview = ({ item }) => fetch(`http://10.0.2.2:3333/api/1.0.0/location/${this.state.locationId}/review/${item.review_id}/like`,
      {
        method: 'POST',
        headers:
          {
            'Content-Type': 'application/json',
            'X-Authorization': this.state.token,
          },
      })
      .then((response) => {
        if (!response.ok) {
          // get error message from body or default to response status
          console.log(response);
        }
        this.getUserData();
      })
      .catch((error) => {
        console.error('There was an error!', error);
      })

    unlikeReview = ({ item }) => fetch(`http://10.0.2.2:3333/api/1.0.0/location/${this.state.locationId}/review/${item.review_id}/like`,
      {
        method: 'DELETE',
        headers:
          {
            'Content-Type': 'application/json',
            'X-Authorization': this.state.token,
          },
      })
      .then((response) => {
        if (!response.ok) {
          // get error message from body or default to response status
          console.log(response);
        }
        this.getUserData();
      })
      .catch((error) => {
        console.error('There was an error!', error);
      })

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
                  width: 100, height: 100, padding: 5, marginLeft: 20, borderRadius: 60,
                }}
                source={{ uri: this.state.locationData.photo_path }}
              />
            </TouchableHighlight>
          </View>
          <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
            {this.state.showFavourite && (
            <TouchableOpacity
              style={{
                alignSelf: 'center',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#00ffea',
                flexDirection: 'row',
                width: 40,
              }}
              onPress={() => this.removeFromFavourite()}
            >
              <MaterialCommunityIcons
                name="heart"
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
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#00ffea',
                flexDirection: 'row',
                width: 40,
              }}
              onPress={() => this.addToFavourite()}
            >
              <MaterialCommunityIcons
                name="heart-outline"
                style={styles.likeIcon}
                color="#00ffea"
                size={19}
              />
            </TouchableOpacity>
            )}
          </View>
        </View>
      )

      render() {
        if (this.state.isLoading) {
          return (
            <View style={styles.mainBg}>
              <FlatList
                data={this.state.locationReviews}
                keyExtractor={(item) => item.review_id.toString()}
                renderItem={({ item, index }) => (
                  <View style={{padding: 20, marginTop:-30}}>
                    <Text style={styles.reviewTextInput}>
                      {item.review_body}
                    </Text>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <Text style={styles.reviewText}>
                        Overall:{' '}
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
                        Quality:{' '}
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
                        Price:{' '}
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
                        Hygeine:{' '}
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
                      {
                    this.checkIfLiked(item.review_id)
                  }
                      {this.state.showLike && (
                      <TouchableOpacity
                        style={{
                          alignSelf: 'center',
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: '#00ffea',
                          flexDirection: 'row',
                          marginTop: 20,
                          width: 200,
                          marginBottom:30

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
                      {!this.state.showLike && (
                      <TouchableOpacity
                        style={{
                          alignSelf: 'center',
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: '#00ffea',
                          flexDirection: 'row',
                          marginTop: 20,
                          width: 200,
                          marginBottom:30

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
          // <SafeAreaView style={styles.mainBg}>
          //   <FlatList
          //     data={this.state.locationReviews}
          //     keyExtractor={(item) => item.review_id.toString()}
          //     renderItem={({ item, index }) => (
          //       <View style={styles.row}>
          //         <Text style={styles.flatListTitle}>Review no: {index}</Text>
          //         <Text style={styles.formTouchText}>Overall: {item.overall_rating}</Text>
          //         <Text style={styles.formTouchText}>Quality: {item.quality_rating}</Text>
          //         <Text style={styles.formTouchText}>Price: {item.price_rating}</Text>
          //         <Text style={styles.formTouchText}>Hygeine: {item.quality_rating}</Text>
          //         <Text style={styles.formTouchText}>{item.likes} likes</Text>
          //         <Text style={styles.formTouchText}>{item.review_body}</Text>
          //         <View style={{ flex: 1, flexDirection: 'row' }}>
          //           {
          //             this.checkIfLiked(item.review_id)
          //           }
          //           {this.state.showLike && (
          //           <TouchableWithoutFeedback onPress={() => this.unlikeReview({ item })}>
          //             <MaterialCommunityIcons
          //               name="thumb-up"
          //               style={styles.likeIcon}
          //               color="#00ffea"
          //               size={19}
          //             />
          //           </TouchableWithoutFeedback>
          //           )}
          //           {!this.state.showLike && (
          //           <TouchableWithoutFeedback onPress={() => this.likeReview({ item })}>
          //             <MaterialCommunityIcons
          //               name="thumb-up-outline"
          //               style={styles.likeIcon}
          //               color="#00ffea"
          //               size={19}
          //             />
          //           </TouchableWithoutFeedback>
          //           )}
          //         </View>
          //       </View>
          //     )}
          //   />
          // </SafeAreaView>
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
