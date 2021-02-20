/* eslint-disable react/no-unused-state */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable radix */
/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-else-return */
import React, { Component } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity, TextInput, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Filter from 'bad-words';

const filter = new Filter();

filter.addWords('cakes', 'tea', 'coffee');

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

class AddReviewScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      locationData: [],
      locationReviews: [],
      token: '',
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

    addReview = async () => {
      console.log('addReview');
      console.log(this.state.token);
      console.log(filter.clean(this.state.review_body));
      const locationId = await AsyncStorage.getItem('@location_id');
      const tokenId = await AsyncStorage.getItem('@session_token');

      this.setState({ token: tokenId });
      this.setState({ location_id: locationId });

      const dataToSend = {
        overall_rating: parseInt(this.state.overall_rating),
        price_rating: parseInt(this.state.price_rating),
        quality_rating: parseInt(this.state.quality_rating),
        clenliness_rating: parseInt(this.state.cleanliness_rating),
        review_body: filter.clean(this.state.review_body),
      };
      console.log(dataToSend);
      return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${this.state.location_id}/review`,
        {
          method: 'POST',
          headers:
          {
            'Content-Type': 'application/json',
            'X-Authorization': this.state.token,
          },
          body: JSON.stringify(dataToSend),
        })
        .then((response) => {
          if (!response.ok) {
            // get error message from body or default to response status
            console.log(response);
          }
          console.log('Addded!');
        })
        .catch((error) => {
          console.error('There was an error!', error);
        });
    }

    render() {
      return (
        <ScrollView style={styles.mainBg}>
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Overall Rating:</Text>
            <TextInput
              style={styles.formInput}
              onChangeText={(overall_rating) => this.setState({ overall_rating })}
              value={this.state.overall_rating}
            />
          </View>
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Price Rating:</Text>
            <TextInput
              style={styles.formInput}
              onChangeText={(price_rating) => this.setState({ price_rating })}
              value={this.state.price_rating}
            />
          </View>
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Quality Rating:</Text>
            <TextInput
              style={styles.formInput}
              onChangeText={(quality_rating) => this.setState({ quality_rating })}
              value={this.state.last_name}
            />
          </View>
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Cleanliness Rating:</Text>
            <TextInput
              style={styles.formInput}
              onChangeText={(cleanliness_rating) => this.setState({ cleanliness_rating })}
              value={this.state.cleanliness_rating}
            />
          </View>
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Review Body:</Text>
            <TextInput
              style={styles.formInput}
              onChangeText={(review_body) => this.setState({ review_body })}
              value={this.state.review_body}
            />
          </View>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => this.addReview()}>
            <Text style={styles.buttonText}>Add a review</Text>
          </TouchableOpacity>
        </ScrollView>
      );
    }
}

export default AddReviewScreen;
