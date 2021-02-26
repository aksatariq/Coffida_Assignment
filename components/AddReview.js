/* eslint-disable no-shadow */
import React, { Component } from 'react';
import {
  Text, View, TouchableOpacity, ActivityIndicator, TextInput, ScrollView, ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Filter from 'bad-words';
import { AirbnbRating } from 'react-native-ratings';
import PropTypes from 'prop-types';
import { checkAllFields } from '../Utilities/Utils';
import styles from '../Styles/styles';

const filter = new Filter();

filter.addWords('cakes', 'tea', 'cake');

class AddReviewScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locationName: '',
      locationTown: '',
      locationId: 0,
      tokenId: 0,
      overallRating: '',
      priceRating: '',
      qualityRating: '',
      clenlinessRating: '',
      reviewBody: '',
      isLoading: true,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.getFieldsForScreen();
    });
  }

  // get data from async storage and store in state to use later on
  getFieldsForScreen = async () => {
    // use multi get to retrieve variables
    AsyncStorage.multiGet(['@location_name', '@location_town', '@location_id', '@session_token']).then((response) => {
      const locationName = (response[0][1]);
      const locationTown = (response[1][1]);
      const locationId = (response[2][1]);
      const tokenId = (response[3][1]);
      this.setState({
        locationName, locationTown, locationId, tokenId, isLoading: false,
      });
    });
  }

  addReview = async () => {
    const {
      overallRating, priceRating, qualityRating, clenlinessRating, reviewBody, locationId, tokenId,
    } = this.state;
    const { navigation } = this.props;

    // checks all fields are complete
    if (checkAllFields(this.state)) {
      // store the users input into an object to send later
      const dataToSend = {
        overall_rating: parseInt(overallRating, 10),
        price_rating: parseInt(priceRating, 10),
        quality_rating: parseInt(qualityRating, 10),
        clenliness_rating: parseInt(clenlinessRating, 10),
        review_body: filter.clean(reviewBody, 10),
      };
      // post request to send
      return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review`,
        {
          method: 'POST',
          headers:
          {
            'Content-Type': 'application/json',
            'X-Authorization': tokenId,
          },
          body: JSON.stringify(dataToSend),
        })
        .then(() => {
          navigation.goBack(null);
        })
        .catch(() => {
          ToastAndroid.show('There was an error, please try again!', ToastAndroid.SHORT);
        });
    }
    return ToastAndroid.show('Please fill in all the fields!', ToastAndroid.SHORT);
  }

  render() {
    const {
      priceRating, qualityRating, clenlinessRating, reviewBody, locationName, locationTown,
    } = this.state;
    const { isLoading, overallRating } = this.state;

    if (!isLoading) {
      return (
        <ScrollView style={styles.mainBg}>

          <Text style={styles.title}>
            {locationName}
            {', '}
            {locationTown}
          </Text>

          <View style={{ padding: 20 }}>
            <Text style={styles.greyText}>Overall Rating:</Text>
            <Text>
              <AirbnbRating
                count={5}
                defaultRating={overallRating}
                size={15}
                showRating={false}
                onFinishRating={(overallRating) => this.setState({ overallRating })}
              />
            </Text>
          </View>

          <View style={{ padding: 20 }}>
            <Text style={styles.greyText}>Price Rating:</Text>
            <Text>
              <AirbnbRating
                count={5}
                defaultRating={priceRating}
                size={15}
                showRating={false}
                onFinishRating={(priceRating) => this.setState({ priceRating })}
              />
            </Text>
          </View>

          <View style={{ padding: 20 }}>
            <Text style={styles.greyText}>Quality Rating:</Text>
            <Text>
              <AirbnbRating
                count={5}
                defaultRating={qualityRating}
                size={15}
                showRating={false}
                onFinishRating={(qualityRating) => this.setState({ qualityRating })}
              />
            </Text>
          </View>

          <View style={{ padding: 20 }}>
            <Text style={styles.greyText}>Cleanliness Rating:</Text>
            <Text>
              <AirbnbRating
                count={5}
                defaultRating={clenlinessRating}
                size={15}
                showRating={false}
                onFinishRating={(clenlinessRating) => this.setState({ clenlinessRating })}
              />
            </Text>
          </View>

          <View style={{ padding: 20 }}>
            <Text style={styles.greyText}>Review Body:</Text>
            <TextInput
              style={styles.greyInputText}
              multiline
              blurOnSubmit
              onChangeText={(reviewBody) => this.setState({ reviewBody })}
              value={reviewBody}
            />
          </View>

          <TouchableOpacity style={styles.greenButton} onPress={() => this.addReview()}>
            <Text style={styles.greenButtonText}>Add</Text>
          </TouchableOpacity>

        </ScrollView>
      );
    }
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

AddReviewScreen.propTypes = {
  navigation: PropTypes.shape({
    addListener: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

export default AddReviewScreen;
