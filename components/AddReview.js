import React, { Component } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity, TextInput, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Filter from 'bad-words';
import { AirbnbRating } from 'react-native-ratings';

const filter = new Filter();

filter.addWords('cakes', 'tea', 'cake');

const styles = StyleSheet.create({

  mainBg: {
    backgroundColor: '#001624',
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
    marginTop: 20,
  },
  greenButton: {
    borderRadius: 3,
    backgroundColor: '#00ffea',
    width: 120,
    color: 'white',
    margin: 20,

  },
  greenButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    height: 35,
    paddingTop: 6,
  },
  formItem: {
    padding: 20,
    // marginTop: 10,
  },
  formLabel: {
    fontSize: 15,
    color: 'grey',
    paddingBottom:10,
  },
  formInput: {
    borderRadius: 3,
    color: 'grey',
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    // marginTop: 5,
  },

});

class AddReviewScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locationName: '',
      locationTown: '',
      overall_rating: '',
      price_rating: '',
      quality_rating: '',
      clenliness_rating: '',
      review_body: '',

    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  checkLoggedIn = async () => {
    const locationName = await AsyncStorage.getItem('@location_name');
    const locationTown = await AsyncStorage.getItem('@location_town');
    this.setState({ locationName });
  }

    addReview = async () => {
      const locationId = await AsyncStorage.getItem('@location_id');
      const tokenId = await AsyncStorage.getItem('@session_token');

      const dataToSend = {
        overall_rating: parseInt(this.state.overall_rating),
        price_rating: parseInt(this.state.price_rating),
        quality_rating: parseInt(this.state.quality_rating),
        clenliness_rating: parseInt(this.state.clenliness_rating),
        review_body: filter.clean(this.state.review_body),
      };
      console.log(dataToSend);

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
          <Text style={styles.header}>{this.state.locationName}</Text>
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Overall Rating:</Text>
            <Text style={styles.reviewText}>
              <AirbnbRating
                count={5}
                defaultRating={this.state.overall_rating}
                size={15}
                showRating={false}
                style={styles.starRating}
                onFinishRating={(overall_rating) => this.setState({ overall_rating })}
              />
            </Text>
          </View>
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Price Rating:</Text>
            <Text style={styles.reviewText}>
              <AirbnbRating
                count={5}
                defaultRating={this.state.price_rating}
                size={15}
                showRating={false}
                style={styles.starRating}
                onFinishRating={(price_rating) => this.setState({ price_rating })}
              />
            </Text>
          </View>
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Quality Rating:</Text>
            <Text style={styles.reviewText}>
              <AirbnbRating
                count={5}
                defaultRating={this.state.quality_rating}
                size={15}
                showRating={false}
                style={styles.starRating}
                onFinishRating={(quality_rating) => this.setState({ quality_rating })}
              />
            </Text>
          </View>
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Cleanliness Rating:</Text>
            <Text style={styles.reviewText}>
              <AirbnbRating
                count={5}
                defaultRating={this.state.clenliness_rating}
                size={15}
                showRating={false}
                style={styles.starRating}
                onFinishRating={(clenliness_rating) => this.setState({ clenliness_rating })}
              />
            </Text>
          </View>
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Review Body:</Text>
            <TextInput
              style={styles.formInput}
              multiline
              blurOnSubmit
              onChangeText={(review_body) => this.setState({ review_body })}
              value={this.state.review_body}
            />
          </View>
          <TouchableOpacity style={styles.greenButton} onPress={() => this.addReview()}>
            <Text style={styles.greenButtonText}>Add</Text>
          </TouchableOpacity>
        </ScrollView>
      );
    }
}

export default AddReviewScreen;
