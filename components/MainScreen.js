/* eslint-disable no-useless-concat */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable radix */
/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-else-return */
import React, { Component } from 'react';
import {
  Text, View, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback,
  ToastAndroid, ActivityIndicator, FlatList, SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { AirbnbRating } from 'react-native-ratings';

const styles = StyleSheet.create({

  mainBg: {
    backgroundColor: '#001624',
    flex: 1,
  },
  Header: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'white',
    paddingLeft: 22,
    paddingTop: 5,
    fontFamily: 'Cochin',
  },
  subTitle: {
    color: 'grey',
    padding: 10,
    fontSize: 15,
    alignSelf: 'center',

  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 5,
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
    margin: 10,
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
  reviewHeader: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'white',
    paddingLeft: 10,
    lineHeight: 25,

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

  likeIcon: {

    color: '#00ffea',
    borderRadius: 20,
    borderWidth: 2,
    width: 40,
    height: 40,
    padding: 10,
    borderColor: '#00ffea',
    overflow: 'hidden',
    marginTop: 15,
  },

  favouriteIcon: {

    color: '#00ffea',
    borderRadius: 20,
    borderWidth: 2,
    width: 40,
    height: 40,
    padding: 9,
    borderColor: '#00ffea',
    overflow: 'hidden',
    marginTop: 20,
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

});

class LocationDetailsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      userData: [],
      swipeoutBtns: [
        {
          text: 'Button',
        },
      ],
      userReviews: [],
      token: '',
      user_id: 0,
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
      listViewData: [{}],

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
      const userId = await AsyncStorage.getItem('@user_id');
      console.log(userId);
      this.setState({ user_id: userId });

      this.getData();
    }

    getData = () => {
      console.log('arrived');
      console.log(this.state.user_id);
      console.log(this.state.token);

      return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${this.state.user_id}`,
        {
          method: 'GET',
          headers:
          {
            'X-Authorization': this.state.token,
          },
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
          console.log(responseJson.reviews);

          this.setState({
            userData: responseJson,
            userReviews: responseJson.reviews,
            isLoading: false,
          });
          await AsyncStorage.setItem('@userData', JSON.stringify(responseJson));
        })

        .catch((error) => {
        // console.error(error);
          ToastAndroid.show(error, ToastAndroid.SHORT);
        });
    };

    updateReview = ({ data }) => {
      this.props.navigation.navigate('updateReview');
      this.props.navigation.navigate('updateReview', {
        userId: this.state.user_id,
        reviewId: data.item.review.review_id,
        locationId: data.item.location.location_id,
      });
    }

    deleteReview = ({ data }) => {
      console.log('deleteReview');
      // console.log(this.state.token);
      // console.log(item.review_id);

      return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${data.item.location.location_id}/review/${data.item.review.review_id}`,
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
          console.log('Deleted!');
          this.getData();
        })
        .catch((error) => {
          console.error('There was an error!', error);
        });
    }

    takePicture = async ({ data }) => {
      console.log('hello');
      console.log(data.item.review.review_id);
      console.log(data.item.location.location_id);

      // this.setId(/, reviewId);
      this.props.navigation.navigate('takePicture', {
        reviewId: data.item.review.review_id,
        locationId: data.item.location.location_id,
      });
    };

    renderHeader = () => (
      <View style={{ marginTop: 25 }}>
        <Text style={styles.Header}>My Reviews:</Text>
      </View>
    )

    render() {
      if (!this.state.isLoading) {
        return (
          <SwipeListView
            style={styles.mainBg}
            data={this.state.userReviews}
            keyExtractor={(item) => item.review.review_id.toString()}
            renderItem={(data) => (
              <View style={styles.rowFront}>
                <View style={styles.row}>
                  <Image
                    style={{ width: 78, height: 123 }}
                    source={{ uri: 'http://10.0.2.2:3333/api/1.0.0/location/' + `${data.item.location.location_id}` + '/review/' + `${data.item.review.review_id}` + '/photo' }}
                  />
                  <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Text style={styles.reviewHeader}>
                      {data.item.location.location_name}{', '} {data.item.location.location_town}
                    </Text>
                    <View style={{ flex: 1, flexDirection: 'row' }}>

                      <Text style={styles.reviewInfo}>
                        Overall:
                      </Text>
                      <View style={{ marginTop: 10 }}>
                        <AirbnbRating
                          count={5}
                          defaultRating={data.item.review.overall_rating}
                          size={15}
                          showRating={false}
                        />
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => this.takePicture({ data })}
                      style={styles.capture}
                    >
                      <MaterialCommunityIcons name="camera" size={23} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            renderHiddenItem={(data) => (
              <View style={{ padding: 20 }}>
                <TouchableWithoutFeedback onPress={() => this.deleteReview({ data })}>
                  <Text style={styles.reviewInfo}>Delete</Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => this.updateReview({ data })}>
                  <Text style={styles.reviewInfo}>Update</Text>
                </TouchableWithoutFeedback>
              </View>
            )}
            leftOpenValue={75}
            rightOpenValue={0}
            ListHeaderComponent={this.renderHeader()}

          />
        );
      } else {
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
    }
}

export default LocationDetailsScreen;
// data={this.state.userReviews}
// keyExtractor={(item) => item.review.review_id.toString()}
// renderItem={({ item }) => (
//   <View style={styles.row}>
//     <Image
//       style={{ width: 78, height: 123 }}
//       source={{ uri: 'http://10.0.2.2:3333/api/1.0.0/location/' + `${item.location.location_id}` + '/review/' + `${item.review.review_id}` + '/photo' }}
//     />
//     <View style={{ flex: 1, flexDirection: 'column' }}>
//       <Text style={styles.reviewHeader}>
//         {item.location.location_name}{', '} {item.location.location_town}
//       </Text>
//       <Text style={styles.reviewInfo}>Overall: {item.review.overall_rating}{' | '}Quality: {item.review.quality_rating}{' | '}Price: {item.review.price_rating}{' | '}Hygeine: {item.review.clenliness_rating}</Text>
//       <Text style={styles.reviewInfo}>{item.review.review_body}</Text>

//       {/* <TouchableWithoutFeedback onPress={() => this.deleteReview({ item })}>
//         <Text style={styles.formTouchText}>DELETE</Text>
//       </TouchableWithoutFeedback>
//       <TouchableWithoutFeedback onPress={() => this.updateReview({ item })}>
//         <Text style={styles.formTouchText}>UPDATE</Text>
//       </TouchableWithoutFeedback> */}
//       <TouchableOpacity
//         onPress={() => this.takePicture({ item })}
//         style={styles.capture}
//       >
//         <MaterialCommunityIcons name="camera" size={23} />
//       </TouchableOpacity>
//     </View>
//   </View>
// )}
// ListHeaderComponent={this.renderHeader()}

// />
