import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {Text,Button,TextInput, Alert, View, StyleSheet,ScrollView, TouchableOpacity, FlatList} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from './MainScreen';
import SignUpScreen from './SignUp';

const Tab = createMaterialBottomTabNavigator();
const color = 'yellow';
export default function HomeApp() {
    return (
      <NavigationContainer independent={true}>
        <Tab.Navigator initialRouteName="Home"
                activeColor="#00ffea"
                inactiveColor="grey"
                barStyle={{ backgroundColor: '#01273b' }}>
          <Tab.Screen name="reviews" component={HomeScreen} options={{
          tabBarLabel: 'Home',
          showIcon: true ,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}/>
          <Tab.Screen name="location" component={HomeScreen} options={{
          tabBarLabel: 'Location',
          showIcon: true ,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="map-marker" color={color} size={26} />
          ),
        }}/>
          <Tab.Screen name="settings" component={SignUpScreen} options={{
          tabBarLabel: 'Settings',
          showIcon: true ,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-cog" color={color} size={26} />
          ),
        }}/>
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
