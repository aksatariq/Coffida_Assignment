
import React, {Component} from 'react';
import {Text,Button,TextInput, Alert, View, StyleSheet,ScrollView, TouchableOpacity, FlatList, ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from './HomeScreen';
import SignUpScreen from './SignUp';

class MainScreen extends Component{

    constructor(props){
        super(props);
    
        this.state = {
          email: '',
          password: '',
        }
      } 

    login = async() => {
        
        const navigation = this.props.navigation;

        return fetch("http://10.0.2.2:3333/api/1.0.0/user/login",
        {
          method:'POST',
          headers: {'Content-Type': 'application/json'},
          body:JSON.stringify(this.state)
        })
        .then((response) => {

            if(response.status == 200){
                
                return response.json();

            }else if(response.status == "400"){
                
                throw "Invalid Email or Password!"

            }else{

                throw "Something went wrong"

            }
    
        })
        .then(async (responseJson) => {
            console.log(responseJson);
            await AsyncStorage.setItem('@session_token', responseJson.token)
            this.props.navigation.navigate("home")
        })

        .catch((error) => {
          console.error(error);
          ToastAndroid.show(error, ToastAndroid.SHORT)
        });
    
    }
    
    render(){
        
        return(

            <View style = {styles.mainBg}>
                <ScrollView>
                <View style={styles.formItem}>
                    <Text style={styles.title}>Coffida</Text>
                </View>

                {/* <View style={styles.formItem}>
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
                    onPress={() => this.login()}
                    >
                    <Text style={styles.formTouchText}>sign in</Text>
                    </TouchableOpacity> */}
                {/* </View> */}
                </ScrollView>
            </View>

        );

    }

}

const styles = StyleSheet.create({

mainBg: {
    backgroundColor:'#001624',
    flex:1,
    flexDirection: 'column',
    justifyContent:'space-around'
},  
title: {
    color:'white',
    fontSize:30,
    alignSelf:'center',
    marginTop:35
},
subTitle: {
    color:'grey',
    padding:10,
    fontSize:15,
    alignSelf:'center'

},
formItem: {
    padding:20
},
formLabel: {
    fontSize:15,
    color:'grey'
},
formInput: {
    borderRadius:3,
    color:'grey',
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    marginTop:20
},
formTouch: {
    backgroundColor:'#00ffea',
    borderRadius:3,
    padding:12,
    width:290,
    alignSelf:'center',
},
formTouchText: {
    fontSize:18,
    fontWeight:'bold',
    color:'white',
    alignSelf:'center'
    
}

});

export default MainScreen;