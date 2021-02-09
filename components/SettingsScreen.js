
import React, {Component} from 'react';
import {Text,Button,TextInput, Alert, View, StyleSheet,ScrollView, TouchableOpacity, FlatList, ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from './HomeScreen';

class SettingsScreen extends Component{

    constructor(props){
        super(props);
    
        this.state = {
          token: '',
          id: '',
          email: '',
          first_name: '',
          last_name: ''
          
        }
        
      } 

    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', () =>{
            this.checkLoggedin();
        });

        console.log(this.state);
        this.getData();

    }

    componentWillUnMount(){
        this.unsubscribe();
    }

    checkLoggedin = async() => {

        const tokenId = await AsyncStorage.getItem('@session_token');
        const userId = await AsyncStorage.getItem('@user_id');

        this.setState({token:tokenId});
        this.setState({id: userId});

        if(tokenId == null) {
            this.props.navigation.navigate('settings');
        }
    }

    getData = () => {
        console.log("calledGTThs");
        console.log(this.state.token);
        return fetch("http://10.0.2.2:3333/api/1.0.0/user/26",// + this.state.id,
        {
          'headers': {
            'X-Authorization': '63214f850c30e182d71d8af39dba84ae'//this.state.token
          }
        })
        .then((response) => {

            console.log(response);

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
                this.props.navigation.navigate("main");
            })
    
            .catch((error) => {
              console.error(error);
              ToastAndroid.show(error, ToastAndroid.SHORT)
            });
        
        }

    logout = async() => {

        await AsyncStorage.removeItem('@session_token');
        this.state.token = "";
        this.props.navigation.navigate('home');
        
    }

    updateUser(){
    
        //validation here 
    
        //send PATCH request to api
        return fetch("http://10.0.2.2:3333/api/1.0.0/user/26",
        {
          method:'PATCH',
          headers: 
            {
                'Content-Type': 'application/json',
                'X-Authorization': '63214f850c30e182d71d8af39dba84ae'
            },
          body:JSON.stringify(this.state)
        })
    
        .then((response) => {
          
          //check the response status we get back
          if(response.status == 201) {
    
            return response.json()
    
          }else if(response.status ==400){
    
            throw 'Failed Validation'
    
          }else{
    
            throw "Something went wrong"
    
          }
        })
    
        .then(async(responseJson) => {
            console.log("User created with id: " + responseJson.id);
            this.props.navigation.navigate("login");
        })
    
        //show if the validation has failed.
        .catch((error) => {
          console.error(error);
          ToastAndroid.show(error, ToastAndroid.SHORT);
        });
    }
    
    render(){
        
        return(

            <View style = {styles.mainBg}>
                <ScrollView>
                <View style={styles.formItem}>
                    <Text style={styles.title}>Manage your account</Text>
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

                 <View style={styles.formItem}>
                    <TouchableOpacity
                    style={styles.formTouch}
                    onPress={() => this.logout()}
                    >
                    <Text style={styles.formTouchText}>logout</Text>
                    </TouchableOpacity>
                 </View> 
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

export default SettingsScreen;