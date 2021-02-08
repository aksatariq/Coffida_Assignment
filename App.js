
import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {Text,Button,TextInput, Alert, View, StyleSheet,ScrollView, TouchableOpacity, FlatList} from 'react-native';
import { Container } from 'native-base';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, creatStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

import HomeScreen from './components/HomeScreen';
import SignUpScreen from './components/SignUp';
import LoginScreen from './components/LoginPage';

export default function App() {
  
  return(
    
    <NavigationContainer>

      <Stack.Navigator>
        <Stack.Screen name = "home" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="signup" component={SignUpScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="login" component={LoginScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
      
    </NavigationContainer>
  );
}

