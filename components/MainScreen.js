import React, { Component } from 'react';
import {
  Text, View, StyleSheet, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class MainScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () =>{
      this.checkLoggedin();
    });

    this.getData();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

    checkLoggedin = async () => {
      const token = await AsyncStorage.getItem('@session_token');
      this.setState({ token });

      if (token == null) {
        this.props.navigation.navigate('settings');
      }
    }

    getData = () => {
      console.log("called");
    }

    render() {
      return (

        <View style={styles.mainBg}>
          <ScrollView>
            <View style={styles.formItem}>
              <Text style={styles.title}>Reviews</Text>
            </View>

            {/* <View style={styles.formItem}>
                    <Text style={styles.formLabel}>First Name:</Text>
                    <TextInput
                    style={styles.formInput}
                    onChangeText={(first_name) => this.setState({first_name})}
                    value={this.state.first_name}
                    />
                </View>

                <View style={styles.formItem}>
                    <Text style={styles.formLabel}>Last Name:</Text>
                    <TextInput
                    style={styles.formInput}
                    onChangeText={(last_name) => this.setState({last_name})}
                    value={this.state.last_name}
                    />
                </View>

                 <View style={styles.formItem}>
                    <Text style={styles.formLabel}>Email:</Text>
                    <TextInput
                    style={styles.formInput}
                    onChangeText={(email) => this.setState({email})}
                    value={this.state.email}
                    />
                </View>

                <View style={styles.formItem}>
                    <Text style={styles.formLabel}>Password:</Text>
                    <TextInput
                    style={styles.formInput}
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    />
                </View>

                <View style={styles.formItem}>
                    <TouchableOpacity
                    style={styles.formTouch}
                    onPress={() => this.updateUser()}
                    >
                    <Text style={styles.formTouchText}>update</Text>
                    </TouchableOpacity>
                 </View>  */}

            {/* <View style={styles.formItem}>
                    <TouchableOpacity
                    style={styles.formTouch}
                    onPress={() => this.logout()}
                    >
                    <Text style={styles.formTouchText}>logout</Text>
                    </TouchableOpacity>
                 </View>  */}
          </ScrollView>
        </View>

      );
    }
}

const styles = StyleSheet.create({

  mainBg: {
    backgroundColor: '#001624',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
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
    alignSelf: 'center',
  },

});

export default MainScreen;
