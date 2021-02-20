/* eslint-disable react/no-unused-state */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable radix */
/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-else-return */
import React, { Component } from 'react';
import {
  Text, View, StyleSheet, TouchableHighlight, Image,
  ToastAndroid, ActivityIndicator, TouchableOpacity, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AirbnbRating } from 'react-native-ratings';
import { TextInput } from 'react-native-gesture-handler';

const styles = StyleSheet.create({

  mainBg: {
    backgroundColor: '#001624',
    flex: 1,
    flexDirection: 'column',
  },
  reviewText: {
    fontSize: 18,
    color: 'white',
    marginLeft: 10,
    flexShrink: 1,
  },
  reviewTextInput: {
    fontSize: 18,
    color: 'white',
    marginLeft: 10,
    height: 80,
    marginTop: -20,
  },
  reviewHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
    marginTop: 10,
  },
  starRating: {
    paddingVertical: 10,
  },

});

class UpdateReviewScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      userData: [],
      userReviews: [],
      token: '',
      location_id: 0,
      user_id: 0,
      review_id: 0,
      overall_rating: '',
      price_rating: '',
      quality_rating: '',
      clenliness_rating: '',
      review_body: '',

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

      if (token !== null) {
        this.state.review_id = this.props.route.params.reviewId;
        this.state.user_id = this.props.route.params.userId;
        this.state.location_id = this.props.route.params.locationId;
        this.state.token = await AsyncStorage.getItem('@session_token');
      }

      console.log('>>>>');
      console.log(this.state.location_id);
      console.log(this.state.review_id);

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
          isLoading: true,
        });

        this.renderData(responseJson.reviews);
      })

      .catch((error) => {
      // console.error(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  };

  renderData = (reviews) => {
    console.log('rendering....');
    console.log(reviews);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < reviews.length; i++) {
      if (reviews[i].review.review_id === this.state.review_id) {
        this.state.userReviews = [];

        this.setState({
          review_body: reviews[i].review.review_body,
          price_rating: reviews[i].review.price_rating,
          quality_rating: reviews[i].review.quality_rating,
          overall_rating: reviews[i].review.overall_rating,
          clenliness_rating: reviews[i].review.clenliness_rating,
          location_name: reviews[i].location.location_name,
          location_town: reviews[i].location.location_town,
          isLoading: false,
          userReviews: reviews[i].review,
        });
      }
    }
  }

  updateReview = () => {
    console.log('updateReview');
    console.log(this.state.token);

    const toSend = {};
    console.log(this.state.overall_rating);
    console.log(this.state.userReviews.overall_rating);
    if (this.state.overall_rating !== this.state.userReviews.overall_rating) {
      toSend.overall_rating = this.state.overall_rating;
      console.log('in here');
    }

    if (this.state.price_rating !== this.state.userReviews.price_rating) {
      toSend.price_rating = this.state.price_rating;
    }

    if (this.state.quality_rating !== this.state.userReviews.quality_rating) {
      toSend.quality_rating = this.state.quality_rating;
    }

    if (this.state.clenliness_rating !== this.state.userReviews.clenliness_rating) {
      toSend.clenliness_rating = this.state.clenliness_rating;
    }

    if (this.state.review_body !== this.state.userReviews.review_body) {
      toSend.review_body = this.state.review_body;
    }
    return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${this.state.location_id}/review/${this.state.review_id}`,
      {
        method: 'PATCH',
        headers:
        {
          'Content-Type': 'application/json',
          'X-Authorization': this.state.token,
        },
        body: JSON.stringify(toSend),
      })
      .then((response) => {
        if (!response.ok) {
          // get error message from body or default to response status
          console.log(response);
        }
        console.log('update!');
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  }

  deletePhoto() {
    console.log('delete  photo');
    Alert.alert('Confirm Delete', 'Are you sure you want to remove this photo?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => this.callDelete() },
      ],
      { cancelable: false });
  }

  callDelete() {
    return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${this.state.location_id}/review/${this.state.review_id}/photo`,
      {
        method: 'DELETE',
        headers:
      {
        'X-Authorization': this.state.token,
      },
      })
      .then((response) => {
        if (!response.ok) {
          // get error message from body or default to response status
          console.log(response);
        }
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
    // }
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
      return (
        <View style={styles.mainBg}>
          <View style={{
            flex: 1, justifyContent: 'space-around', marginLeft: 10, flexDirection: 'column',
          }}
          >
            <View>
              <TouchableOpacity
                style={{
                  backgroundColor: '#00ffea',
                  borderRadius: 3,
                  width: 80,
                  height: 30,
                  alignSelf: 'flex-end',
                  marginRight: 20,
                  padding: 3,
                }}
                onPress={() => this.updateReview()}
              >
                <Text style={styles.reviewText}>update</Text>
              </TouchableOpacity>

              <TouchableHighlight onPress={() => this.deletePhoto()}>
                <Image
                  style={{
                    width: 110, height: 110, padding: 5, borderRadius: 60, alignSelf: 'center',
                  }}
                  source={{ uri: 'http://10.0.2.2:3333/api/1.0.0/location/' + `${this.state.location_id}` + '/review/' + `${this.state.review_id}` + '/photo' }}
                />
              </TouchableHighlight>
              <Text style={styles.reviewHeader}>
                {this.state.location_name}
                {', '}
                {' '}
                {this.state.location_town}
              </Text>
            </View>
            <Text style={styles.reviewText}>
              Overall:{' '}
              <AirbnbRating
                count={5}
                defaultRating={this.state.overall_rating}
                size={15}
                showRating={false}
                style={styles.starRating}
                onFinishRating={( overall_rating ) => this.setState({overall_rating})}
              />
            </Text>
            <Text style={styles.reviewText}>
              Quality:{' '}
              <AirbnbRating
                count={5}
                defaultRating={this.state.quality_rating}
                size={15}
                style={styles.starRating}
                showRating={false}
                onFinishRating={( quality_rating ) => this.setState({quality_rating})}
              />
            </Text>
            <Text style={styles.reviewText}>
              Price:{' '}
              <AirbnbRating
                count={5}
                defaultRating={this.state.price_rating}
                size={15}
                showRating={false}
                style={styles.starRating}
                onFinishRating={( price_rating ) => this.setState({price_rating})}

              />
            </Text>
            <Text style={styles.reviewText}>
              Hygeine:{' '}
              <AirbnbRating
                count={5}
                defaultRating={this.state.clenliness_rating}
                size={15}
                showRating={false}
                style={styles.starRating}
                onFinishRating={( clenliness_rating ) => this.setState({clenliness_rating})}
              />
            </Text>
            <TextInput
              style={styles.reviewTextInput}
              multiline
              numberOfLines={5}
              blurOnSubmit
              onChangeText={( review_body ) => this.setState({review_body})}
            >
              {this.state.review_body}
            </TextInput>

          </View>
        </View>
      );
    }
  }
}

export default UpdateReviewScreen;
