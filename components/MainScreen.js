import React, { Component } from 'react';
import {
  Text, View, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback,
  ToastAndroid, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { AirbnbRating } from 'react-native-ratings';
import PropTypes from 'prop-types';

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
      userReviews: [],
      token: '',
      userId: 0,

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

    this.setState({ token, userId });

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
        } if (response.status === '400') {
          throw new Error('Bad request!');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then(async (responseJson) => {
        this.setState({
          userReviews: responseJson.reviews,
          isLoading: false,
        });
        await AsyncStorage.setItem('@userData', JSON.stringify(responseJson));
      })

      .catch(() => {
        ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      });
  };

  updateReview = ({ data }) => {
    const { navigation } = this.props;
    const { userId } = this.state;
    navigation.navigate('updateReview', {
      userId,
      reviewId: data.item.review.review_id,
      locationId: data.item.location.location_id,
    });
  }

  deleteReview = ({ data }) => {
    const { token } = this.state;

    return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${data.item.location.location_id}/review/${data.item.review.review_id}`,
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
        this.getData();
      })
      .catch(() => {
        ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      });
  }

  takePicture = async ({ data }) => {
    const { navigation } = this.props;
    navigation.navigate('takePicture', {
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
    const { isLoading, userReviews } = this.state;
    if (!isLoading) {
      return (
        <SwipeListView
          style={styles.mainBg}
          data={userReviews.sort(
            (a, b) => a.review.review_id.toString().localeCompare(b.review.review_id.toString()),
          )}
          closeOnRowOpen
          closeOnScroll
          closeOnRowPress
          keyExtractor={(item) => item.review.review_id.toString()}
          renderItem={(data) => (
            <View style={styles.rowFront}>
              <View style={styles.row}>
                <Image
                  style={{ width: 78, height: 123, backgroundColor: '#001624' }}
                  source={{ uri: `http://10.0.2.2:3333/api/1.0.0/location/${`${data.item.location.location_id}`}/review/${`${data.item.review.review_id}`}/photo?timestamp=${Date.now()}` }}
                />
                <View style={{ flex: 1, flexDirection: 'column' }}>
                  <Text onPress={() => this.updateReview({ data })} style={styles.reviewHeader}>
                    {data.item.location.location_name}
                    {', '}
                    {' '}
                    {data.item.location.location_town}
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
            </View>
          )}
          leftOpenValue={75}
          rightOpenValue={0}
          ListHeaderComponent={this.renderHeader()}
        />
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

LocationDetailsScreen.propTypes = {
  navigation: PropTypes.shape({
    addListener: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default LocationDetailsScreen;
