import React, {Component} from 'react';
import {Text,Button,TextInput, Alert,Image, View, StyleSheet,ScrollView, TouchableOpacity, FlatList} from 'react-native';
import { Container } from 'native-base';
import { endAsyncEvent } from 'react-native/Libraries/Performance/Systrace';


class HomeScreen extends Component{

    render(){
      
     const navigation = this.props.navigation;
    
      return(
        <View style = {styles.mainBg}>

          <View >
            <Text style={styles.title}>Welcomee to Coffida</Text>
          </View>

          <View style={styles.buttonOrder}>  
            
            <View style={styles.buttonView}>
              <TouchableOpacity
                style={styles.greenButton}
                onPress={() => navigation.navigate('signup')}
                >
                <Text style={styles.buttonText}>SIGN UP</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonView2}>
              <TouchableOpacity
                style={styles.buttonNoBg}
                onPress={() => navigation.navigate('login')}
                >
                <Text style={styles.buttonText2}>LOGIN</Text>
              </TouchableOpacity>
            </View>

          </View>

        </View>

        
      );
    }
  }

const styles = StyleSheet.create({

mainBg: {
  backgroundColor:'#001624',
  flex:1,
  flexDirection: 'column', // can be column (default), row, row-reverse, column-reverse
  justifyContent: 'space-around', // can be flex-start (default), flex-end, center, space-between, space-around, space-evenly
  alignItems: 'center'
},

buttonView:{
  backgroundColor:'#00ffea',
  borderRadius:3,
},
buttonView2:{
  borderRadius: 3,
  borderWidth: 1,
  borderColor: '#00ffea',
  marginTop:10
},
greenButton:{
  padding:15,
  alignSelf:'center',
},
buttonNoBg:{
  padding:15,
  width:290,
  alignSelf:'center',
  paddingLeft:119
},
title:{
  color:'white',
  fontSize:30
},
buttonText:{
  color:'white',
  fontSize:18
},
buttonText2:{
  color:'#00ffea',
  fontSize:18
}

});

  export default HomeScreen;
