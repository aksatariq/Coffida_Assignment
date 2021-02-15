/* eslint-disable react/no-unused-state */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable radix */
/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-else-return */
import React, { Component } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback,
  ToastAndroid, ActivityIndicator, FlatList, ScrollView, Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RNCamera } from 'react-native-camera';

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

class LocationDetailsScreen extends Component {
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
      const idCheck = this.props.route.params.locationId;
      this.setState({ location_id: idCheck });

      this.getData();
    }

    getData = () => {
      console.log('arrived');
      console.log(this.state.location_id);
      console.log(this.state.token);

      return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${this.state.location_id}`)
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
          console.log(responseJson);
          this.setState({
            locationData: responseJson,
            locationReviews: responseJson.location_reviews,
            isLoading: true,
          });
        })

        .catch((error) => {
        // console.error(error);
          ToastAndroid.show(error, ToastAndroid.SHORT);
        });
    };

    addToFavourite = () => {
      console.log('favourite');
      return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${this.state.location_id}/favourite`,
        {
          method: 'POST',
          headers: { 'X-Authorization': this.state.token },
        })
        .then((response) => {
          if (!response.ok) {
            // get error message from body or default to response status
            console.log('error');
          }
          console.log('added!');
        })
        .catch((error) => {
          console.error('There was an error!', error);
        });
    }

    removeFromFavourite = () => {
      console.log('remove favourite');
      return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${this.state.location_id}/favourite`,
        {
          method: 'DELETE',
          headers: { 'X-Authorization': this.state.token },
        })
        .then((response) => {
          if (!response.ok) {
            // get error message from body or default to response status
            console.log('error');
          }
          console.log('deleted!');
        })
        .catch((error) => {
          console.error('There was an error!', error);
        });
    }

    addReview = () => {
      console.log('addReview');
      console.log(this.state.token);

      const dataToSend = {
        overall_rating: parseInt(this.state.overall_rating),
        price_rating: parseInt(this.state.price_rating),
        quality_rating: parseInt(this.state.quality_rating),
        clenliness_rating: parseInt(this.state.cleanliness_rating),
        review_body: this.state.review_body,
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

    updateReview = ({ item }) => {
      console.log('updateReview');
      console.log(this.state.token);
      console.log(item);

      const toSend = {};

      if (this.state.overall_rating !== item.overall_rating) {
        toSend.overall_rating = this.state.overall_rating;
        // eslint-disable-next-line no-unused-expressions
      }

      if (this.state.price_rating !== item.price_rating) {
        toSend.price_rating = this.state.price_rating;
      }

      if (this.state.quality_rating !== item.quality_ratings) {
        toSend.quality_rating = this.state.quality_rating;
      }

      if (this.state.review_body !== item.review_body) {
        toSend.review_body = this.state.review_body;
      }
      console.log(toSend);
      return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${this.state.location_id}/review`,
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

    deleteReview = ({ item }) => {
      console.log('deleteReview');
      console.log(this.state.token);
      console.log(item.review_id);

      return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${this.state.location_id}/review/${item.review_id}`,
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
        })
        .catch((error) => {
          console.error('There was an error!', error);
        });
    }

    likeReview = ({ item }) => {
      console.log('like');
      console.log(this.state.token);
      console.log(item.review_id);

      return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${this.state.location_id}/review/${item.review_id}/like`,
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
          console.log('liked!');
        })
        .catch((error) => {
          console.error('There was an error!', error);
        });
    }

    unlikeReview = ({ item }) => {
      console.log('unliked');
      console.log(this.state.token);
      console.log(item.review_id);

      return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${this.state.location_id}/review/${item.review_id}/like`,
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
          console.log('unliked!');
        })
        .catch((error) => {
          console.error('There was an error!', error);
        });
    }

    takePicture = async () => {
      if (this.camera) {
        const options = { quality: 0.5, base64: true };
        const data = await this.camera.takePictureAsync(options);
        console.log(data.uri);
      }
    }

    render() {
      if (this.state.isLoading) {
        return (
          <View style={styles.mainBg}>
            <View>
              <RNCamera
                ref={(ref) => {
                  this.camera = ref;
                }}
                style={{
                  flex: 1,
                  width: '100%',
                }}
              />
              <Button title="Take photo" onPress={() => { this.takePicture(); }} />
            </View>
            <ScrollView>
              <TouchableOpacity onPress={() => this.addToFavourite()}>
                <Text style={styles.formTouchText}>Add to favourite</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.removeFromFavourite()}>
                <Text style={styles.formTouchText}>Remove from favourite</Text>
              </TouchableOpacity>
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
              <TouchableOpacity onPress={() => this.addReview()}>
                <Text style={styles.formTouchText}>Add a review</Text>
              </TouchableOpacity>
              <Text style={styles.formTouchText}>{this.state.locationData.location_name}</Text>
              <Text style={styles.formTouchText}>{this.state.locationData.location_town}</Text>
              <View>
                <FlatList
                  data={this.state.locationReviews}
                  keyExtractor={(item) => item.review_id.toString()}
                  renderItem={({ item, index }) => (
                    <View>
                      <Text style={styles.formTouchText}>Review number: {index}</Text>
                      {/* <TextInput style={styles.formTouchText}>{item.overall_rating}</TextInput>
                      <TextInput style={styles.formTouchText}>{item.quality_rating}</TextInput>
                      <TextInput style={styles.formTouchText}>{item.price_rating}</TextInput>
                      <TextInput style={styles.formTouchText}>{item.clenliness_rating}</TextInput> */}
                      <TextInput style={styles.formTouchText}>{item.review_body}</TextInput>
                      <Text style={styles.formTouchText}>{item.likes} likes</Text>
                      <TouchableWithoutFeedback onPress={() => this.deleteReview({ item })}>
                        <Text style={styles.formTouchText}>DELETE</Text>
                      </TouchableWithoutFeedback>
                      <TouchableWithoutFeedback onPress={() => this.updateReview({ item })}>
                        <Text style={styles.formTouchText}>UPDATE</Text>
                      </TouchableWithoutFeedback>
                      <TouchableWithoutFeedback onPress={() => this.likeReview({ item })}>
                        <Text style={styles.formTouchText}>Like</Text>
                      </TouchableWithoutFeedback>
                      <TouchableWithoutFeedback onPress={() => this.unlikeReview({ item })}>
                        <Text style={styles.formTouchText}>Unlike</Text>
                      </TouchableWithoutFeedback>
                    </View>
                  )}
                />
              </View>
            </ScrollView>
          </View>
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
