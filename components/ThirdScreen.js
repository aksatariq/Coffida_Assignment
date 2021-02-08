import React, {Component} from 'react';
import {Text,Button,TextInput, Alert, View, StyleSheet,ScrollView, TouchableOpacity, FlatList} from 'react-native';
import { Container } from 'native-base';

class ContactScreen extends Component{
  static navigationOptions ={

    header:null
  }
    render(){
      
      const navigation = this.props.navigation;

      return(
        <View>
          <Text>Third Screen</Text>
          <Button  
            title = "About Me"
            onPress={() => navigation.navigate('login')}
            />
        </View>
      );
    }
  }

  export default ContactScreen;
