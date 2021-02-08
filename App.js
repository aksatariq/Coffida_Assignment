//commit 

import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {Text,Button,TextInput, Alert, View, StyleSheet,ScrollView, TouchableOpacity, FlatList} from 'react-native';
import { Container } from 'native-base';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, creatStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

import LoginScreen from './components/loginScreen';
import SignUp from './components/SignUp';
import ContactScreen from './components/ThirdScreen';

export default function App() {
  
  return(
    
    <NavigationContainer>

      <Stack.Navigator>
        <Stack.Screen name = "login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="signUp" component={SignUp} options={{ headerShown: false }}/>
        <Stack.Screen name="Contact" component={ContactScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
      
    </NavigationContainer>
  );
}

