import React, {Component} from 'react';
import {Text,Button,TextInput, Alert,Image, View, StyleSheet,ScrollView, TouchableOpacity, FlatList} from 'react-native';
import { Container } from 'native-base';
import { endAsyncEvent } from 'react-native/Libraries/Performance/Systrace';

class SignUp extends Component{
  
  constructor(props){
    super(props);

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    }
  } 

  signUp(){
    return fetch("http://10.0.2.2:3333/api/1.0.0/user",
    {
      method:'POST',
      headers: {'Content-Type': 'application/json'},
      body:JSON.stringify({
        first_name:this.state.first_name,
        last_name:this.state.last_name,
        email:this.state.email,
        password:this.state.password,

      })
    })
    .then((response) => {
      Alert.alert("User Added!");

    })
    .catch((error) => {
      console.error(error);
    });

  }
  

  render(){

    return(

      <View style = {styles.mainBg}>

        <ScrollView>

         <View style={styles.formItem}>
            <Text style={styles.title}>Coffida Registration!</Text>
          <Text style={styles.subTitle}>Create an account</Text>
          </View>
          
          <View style={styles.formItem}>
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
              secureTextEntry
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
            />
          </View>
  
          {/* <View style={styles.formItem}>
            <Text style={styles.formLabel}>Confirm Password:</Text>
            <TextInput
              style={styles.formInput}
              secureTextEntry
              onChangeText={(confirmPass) => this.setState({confirmPass})}
              value={this.state.confirmPass}
            />
          </View> */}
  
          <View style={styles.formItem}>
            <TouchableOpacity
              style={styles.formTouch}
              onPress={() => this.signUp()}
            >
              <Text style={styles.formTouchText}>sign up</Text>
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
    flexDirection: 'row'
        
  },
  title: {
    color:'white',
    fontSize:30,
    alignSelf:'center'
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
    

export default SignUp;
