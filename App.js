/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import 'react-native-gesture-handler';
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Button, HeaderBackButton } from 'react-native';

// import screens
import HomeScreen from './components/HomeScreen';
import SignUpScreen from './components/SignUp';
import LoginScreen from './components/LoginPage';
import MainScreen from './components/MainScreen';
import SettingsScreen from './components/SettingsScreen';
import SearchScreen from './components/SearchScreen';
import LocationScreen from './components/LocationDetailsScreen';
import LocationReviews from './components/LocationReviews';
import AddReviewScreen from './components/AddReview';
import UpdateReviewScreen from './components/UpdateReview';
import TakePictureScreen from './components/TakePicture';
import NearestLocation from './components/NearestLocation';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

function goTo() {
  this.props.navigation.navigate('addReview');
}
function getHeaderTitle(route) {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';

  // eslint-disable-next-line default-case
  switch (routeName) {
    case 'location':
      return '';
    case 'reviews':
      return 'Coffida';
    case 'search':
      return 'Coffida';
    case 'settings':
      return 'Coffida';
  }
}

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
        component={NearestLocation}
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
        <Stack.Screen
          name="main"
          component={HomeTabs}

          options={({ route }) => ({
            headerTitle: getHeaderTitle(route),
            headerStyle: {
              backgroundColor: '#001624',
            },
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerShown: true,
            headerLeft: null,
            gesturesEnabled: false,
          })}
        />
        <Stack.Screen
          name="locationReviews"
          component={LocationReviews}
          options={({ navigation }) => ({
            title: 'Coffida',
            headerStyle: {
              backgroundColor: '#001624',
            },
            headerRight: () => (
              <Button
                title="Write Review"
                onPress={() => navigation.navigate('addReview')}
                color="#001624"
              />
            ),
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerShown: true,
          })}
        />

        <Stack.Screen
          name="addReview"
          component={AddReviewScreen}
          options={{
            title: 'Coffida',
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#001624',
            },
            headerTintColor: 'white',
            headerShown: true,
            navigationOptions: ({ navigation }) => ({
              headerLeft: (<HeaderBackButton onPress={() => navigation.navigate('locationReviews')} />),
            }),
          }}
        />
        <Stack.Screen
          name="updateReview"
          component={UpdateReviewScreen}
          options={{
            title: 'Coffida',
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#001624',
            },
            headerTintColor: 'white',
            headerShown: true,
            navigationOptions: ({ navigation }) => ({
              headerLeft: (<HeaderBackButton onPress={() => navigation.navigate('main')} />),
            }),
          }}
        />
        <Stack.Screen
          name="takePicture"
          component={TakePictureScreen}
          options={{
            title: 'Coffida',
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#001624',
            },
            headerTintColor: 'white',
            headerShown: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
