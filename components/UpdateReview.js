/* eslint-disable react/no-unused-state */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable radix */
/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-else-return */
import React, { Component } from 'react';
import {
  Text, View, StyleSheet, SafeAreaView, Image, TouchableWithoutFeedback,
  ToastAndroid, ActivityIndicator, FlatList, ScrollView, Button,
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
  buttonStyle: {
    borderRadius: 3,
    backgroundColor: '#00ffea',
    width: 120,
    color: 'white',
    margin: 20,

  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    height: 35,
    paddingTop: 6,
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
      location_id: 0,
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
        console.log('matched id');
        console.log(reviews[i].review);

        this.setState({
          review_body: reviews[i].review.review_body,
          price_rating: reviews[i].review.review_pricerating,
          quality_rating: reviews[i].review.review_qualityrating,
          overall_rating: reviews[i].review.review_overallrating,
          clenliness_rating: reviews[i].review.review_clenlinessrating,
          location_name: reviews[i].location.location_name,
          location_town: reviews[i].location.location_town,
          isLoading: false,
        });
      }
    }
  }

  updateReview = ({ item }) => {
    console.log('updateReview');
    console.log(this.state.token);
    console.log(item);

    const toSend = {};

    if (this.state.overall_rating !== item.review.review_overallrating) {
      toSend.overall_rating = this.state.overall_rating;
      // eslint-disable-next-line no-unused-expressions
    }

    if (this.state.price_rating !== item.review.review_pricerating) {
      toSend.price_rating = this.state.price_rating;
    }

    if (this.state.quality_rating !== item.review.review_qualityrating) {
      toSend.quality_rating = this.state.quality_rating;
    }

    if (this.state.review_body !== item.review.review_body) {
      toSend.review_body = this.state.review_body;
    }
    console.log(toSend);
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
        <View style={styles.row}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={styles.reviewHeader}>
              {this.state.location_name}
              {', '}
              {' '}
              {this.state.location_town}
            </Text>
            <Text style={styles.reviewInfo}>
              Overall:
              {this.state.overall_rating}
              {' | '}
              Quality:
              {' '}
              {this.state.quality_rating}
              {' | '}
              Price:
              {this.state.price_rating}
              {' | '}
              Hygeine:
              {' '}
              {this.state.clenliness_rating}
              Review Body:
              {' '}
              {this.state.review_body}
            </Text>
          </View>
        </View>
      );
    }
  }
}

export default UpdateReviewScreen;
