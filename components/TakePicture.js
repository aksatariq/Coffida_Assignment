/* eslint-disable consistent-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import {
  View, Button, Alert, StyleSheet,
} from 'react-native';
// import PropTypes from 'prop-types';
import { RNCamera } from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

// eslint-disable-next-line react/prefer-stateless-function
class TakePictureScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reviewId: 0,
      locationId: 0,
      token: '',

    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedin();
    });
  }

    checkLoggedin = async () => {
      const token = await AsyncStorage.getItem('@session_token');
      this.setState({ token });

      if (token != null) {
        this.state.reviewId = this.props.route.params.reviewId;
        this.state.locationId = this.props.route.params.locationId;
        this.state.token = await AsyncStorage.getItem('@session_token');

        console.log(this.state.locationId);
        console.log(this.state.reviewId);
        console.log(this.state.token);
      }
    }

    takePicture = async () => {
      if (this.camera) {
        const options = { quality: 0.5, base64: true, pauseAfterCapture: true };
        const data = await this.camera.takePictureAsync(options);

        console.log(data.uri);
        console.log(this.state.token);
        return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${this.state.locationId}/review/${this.state.reviewId}/photo`,
          {
            method: 'POST',
            headers:
          {
            'Content-Type': 'image/jpeg',
            'X-Authorization': this.state.token,
          },
            body: data,
          })
          .then((response) => {
            if (!response.ok) {
              // get error message from body or default to response status
              console.log(response);
            }
            this.props.navigation.navigate('main');
          })
          .catch((error) => {
            console.error('There was an error!', error);
          });
      }
    };

    render() {
      return (
        <View style={styles.mainBg}>
          <View>
            <RNCamera
              ref={(ref) => {
                this.camera = ref;
              }}
              captureAudio={false}
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              style={{
                flex: 1,
              }}
            />
            <Button title="Take photo" onPress={() => { this.takePicture(); }} />
          </View>

        </View>
      );
    }
}

// HomeScreen.propTypes = {
//   navigation: PropTypes.shape({
//     navigate: PropTypes.func.isRequired,
//   }).isRequired,
// };

const styles = StyleSheet.create({

  mainBg: {
    backgroundColor: '#001624',
    flex: 1,
    flexDirection: 'column', // can be column (default), row, row-reverse, column-reverse
    justifyContent: 'space-around', // can be flex-start (default), flex-end, center, space-between, space-around, space-evenly
    alignItems: 'center',
  },

  buttonView: {
    backgroundColor: '#00ffea',
    borderRadius: 3,
  },
  buttonView2: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#00ffea',
    marginTop: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
    width: 20,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  greenButton: {
    padding: 15,
    alignSelf: 'center',
  },
  buttonNoBg: {
    padding: 15,
    width: 290,
    alignSelf: 'center',
    paddingLeft: 119,
  },
  title: {
    color: 'white',
    fontSize: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  buttonText2: {
    color: '#00ffea',
    fontSize: 18,
  },

});

export default TakePictureScreen;
