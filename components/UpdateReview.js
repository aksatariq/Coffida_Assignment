/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-shadow */
import React, { Component } from 'react';
import {
  Text, View, StyleSheet, TouchableHighlight, Image,
  ToastAndroid, ActivityIndicator, TouchableOpacity, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AirbnbRating } from 'react-native-ratings';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Filter from 'bad-words';
import PropTypes from 'prop-types';
import styles from './styles';

const filter = new Filter();

filter.addWords('cakes', 'tea', 'cake');

const updateReviewStyles = StyleSheet.create({

  reviewText: {
    fontSize: 15,
    color: 'grey',
    width: 100,
    flexShrink: 1,
  },
  reviewTextInput: {
    fontSize: 15,
    color: 'grey',
    marginLeft: 20,
  },
});

class UpdateReviewScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      userReviews: [],
      token: '',
      locationId: 0,
      locationName: '',
      locationTown: '',
      userId: 0,
      reviewId: 0,
      overallRating: '',
      priceRating: '',
      qualityRating: '',
      clenlinessRating: '',
      reviewBody: '',

    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.getFields();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getFields = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    this.state.reviewId = this.props.route.params.reviewId;
    this.state.userId = this.props.route.params.userId;
    this.state.locationId = this.props.route.params.locationId;
    this.setState({ token });

    this.getData();
  }

  getData = () => {
    const { userId, token } = this.state;
    return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${userId}`,
      {
        method: 'GET',
        headers:
        {
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
          userReviews: responseJson.reviews,
          isLoading: true,
        });

        this.renderData(responseJson.reviews);
      })

      .catch(() => {
        ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      });
  };

  renderData = (reviews) => {
    const { reviewId } = this.state;

    for (let i = 0; i < reviews.length; i += 1) {
      if (reviews[i].review.review_id === reviewId) {
        this.state.userReviews = [];

        this.setState({
          reviewBody: reviews[i].review.review_body,
          priceRating: reviews[i].review.price_rating,
          qualityRating: reviews[i].review.quality_rating,
          overallRating: reviews[i].review.overall_rating,
          clenlinessRating: reviews[i].review.clenliness_rating,
          locationName: reviews[i].location.location_name,
          locationTown: reviews[i].location.location_town,
          isLoading: false,
          userReviews: reviews[i].review,
        });
      }
    }
  }

  updateReview = async () => {
    const {
      overallRating, priceRating, qualityRating, clenlinessRating,
      reviewBody, userReviews, locationId, reviewId, token,
    } = this.state;
    const toSend = {};
    if (overallRating !== userReviews.overall_rating) {
      toSend.overall_rating = overallRating;
    }

    if (priceRating !== userReviews.price_rating) {
      toSend.price_rating = priceRating;
    }

    if (qualityRating !== userReviews.quality_rating) {
      toSend.quality_rating = qualityRating;
    }

    if (clenlinessRating !== userReviews.clenliness_rating) {
      toSend.clenliness_rating = clenlinessRating;
    }

    if (reviewBody !== userReviews.review_body && reviewBody !== '') {
      toSend.review_body = filter.clean(reviewBody);
    }

    if (reviewBody === '') {
      ToastAndroid.show('Please fill in all fields!', ToastAndroid.SHORT);
    } else {
      try {
        const response = await fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review/${reviewId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'X-Authorization': token,
            },
            body: JSON.stringify(toSend),
          });
        const { navigation } = this.props;
        if (!response.ok) {
          ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
        }
        navigation.goBack(null);
      } catch (e) {
        ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      }
    }
  }

  deletePhoto() {
    Alert.alert('Confirm Delete', 'Are you sure you want to remove this photo?',
      [
        {
          text: 'Cancel',
          onPress: () => ToastAndroid.show('Something went wrong', ToastAndroid.SHORT),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => this.callDelete() },
      ],
      { cancelable: false });
  }

  callDelete() {
    const { locationId, reviewId, token } = this.state;
    return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review/${reviewId}/photo`,
      {
        method: 'DELETE',
        headers:
      {
        'X-Authorization': token,
      },
      })
      .then((response) => {
        if (!response.ok) {
          // get error message from body or default to response status
          ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
        }
        this.getData();
      })
      .catch(() => {
        ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      });
  }

  render() {
    const {
      overallRating, qualityRating, priceRating, clenlinessRating, reviewBody,
      locationTown, locationName, locationId, reviewId, isLoading,
    } = this.state;
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
      <View style={styles.mainBg}>
        <ScrollView>
          <View style={{ padding: 20 }}>
            <TouchableHighlight onPress={() => this.deletePhoto()}>
              <Image
                style={{
                  width: 150, height: 150, padding: 5, transform: [{ rotate: '90deg' }], alignSelf: 'center',
                }}
                source={{ uri: `http://10.0.2.2:3333/api/1.0.0/location/${`${locationId}`}/review/${`${reviewId}`}/photo/?timestamp=${Date.now()}` }}
              />
            </TouchableHighlight>
            <Text style={styles.title}>
              {locationName}
              {', '}
              {' '}
              {locationTown}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', padding: 20 }}>
            <Text style={updateReviewStyles.reviewText}>
              Overall:
              {' '}
            </Text>
            <AirbnbRating
              count={5}
              defaultRating={overallRating}
              size={15}
              showRating={false}
              onFinishRating={(overallRating) => this.setState({ overallRating })}
            />
          </View>
          <View style={{ flexDirection: 'row', padding: 20 }}>
            <Text style={updateReviewStyles.reviewText}>
              Quality:
              {' '}
            </Text>

            <AirbnbRating
              count={5}
              defaultRating={qualityRating}
              size={15}
              showRating={false}
              onFinishRating={(qualityRating) => this.setState({ qualityRating })}
            />

          </View>
          <View style={{ flexDirection: 'row', padding: 20 }}>
            <Text style={updateReviewStyles.reviewText}>
              Price:
              {' '}
            </Text>
            <AirbnbRating
              count={5}
              defaultRating={priceRating}
              size={15}
              showRating={false}
              onFinishRating={(priceRating) => this.setState({ priceRating })}
            />
          </View>
          <View style={{ flexDirection: 'row', padding: 20 }}>
            <Text style={updateReviewStyles.reviewText}>
              Hygeine:
              {' '}
            </Text>
            <AirbnbRating
              count={5}
              defaultRating={clenlinessRating}
              size={15}
              showRating={false}
              onFinishRating={(clenlinessRating) => this.setState({ clenlinessRating })}
            />

          </View>
          <TextInput
            style={updateReviewStyles.reviewTextInput}
            multiline
            blurOnSubmit
            placeholder="Add a comment"
            placeholderTextColor="grey"
            onChangeText={(reviewBody) => this.setState({ reviewBody })}
          >
            {reviewBody}
          </TextInput>
          <TouchableOpacity
            style={styles.greenButton}
            onPress={() => this.updateReview()}
          >
            <Text style={styles.greenButtonText}>update</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

UpdateReviewScreen.propTypes = {
  navigation: PropTypes.shape({
    addListener: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

export default UpdateReviewScreen;
