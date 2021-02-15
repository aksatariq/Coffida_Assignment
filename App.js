/* eslint-disable react/prop-types */
import 'react-native-gesture-handler';
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// import screens
import HomeScreen from './components/HomeScreen';
import SignUpScreen from './components/SignUp';
import LoginScreen from './components/LoginPage';
import MainScreen from './components/MainScreen';
import SettingsScreen from './components/SettingsScreen';
import SearchScreen from './components/SearchScreen';
import LocationScreen from './components/LocationDetailsScreen';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Main"
      activeColor="#00ffea"
      inactiveColor="grey"
      barStyle={{ backgroundColor: '#01273b' }}
    >
      <Tab.Screen
        name="reviews"
        component={MainScreen}
        options={{
          tabBarLabel: 'Home',
          showIcon: true,
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={23} />
          ),
        }}
      />
      <Tab.Screen
        name="location"
        component={MainScreen}
        options={{
          tabBarLabel: 'Location',
          showIcon: true,
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="map-marker" color={color} size={23} />
          ),
        }}
      />
      <Tab.Screen
        name="search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          showIcon: true,
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={23} />
          ),
        }}
      />
      <Tab.Screen
        name="settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          showIcon: true,
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-cog" color={color} size={23} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false,
      }}
      >
        <Stack.Screen name="home" component={HomeScreen} />

        <Stack.Screen
          name="signup"
          component={SignUpScreen}
          options={{
            title: '',
            headerStyle: {
              backgroundColor: '#001624',
            },
            headerTintColor: '#00ffea',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="login"
          component={LoginScreen}
          options={{
            title: '',
            headerStyle: {
              backgroundColor: '#001624',
            },
            headerTintColor: '#00ffea',
            headerShown: true,
          }}
        />
        <Stack.Screen name="main" component={HomeTabs} />
        <Stack.Screen
          name="locationDetails"
          component={LocationScreen}
          options={{
            title: '',
            headerStyle: {
              backgroundColor: '#001624',
            },
            headerTintColor: '#00ffea',
            headerShown: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
