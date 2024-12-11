import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { auth } from "./src/firebase/config"; // Make sure the path is correct

import LoginScreen from './src/screens/LoginScreen/LoginScreen.js'
import HomeScreen from './src/screens/HomeScreen/HomeScreen.js';
import RegistrationScreen from './src/screens/RegistrationScreen/RegistrationScreen';
import EventListScreen from './src/screens/EventListScreen/EventListScreen'; // Import Event List Screen
import EventDetailScreen from './src/screens/EventDetailScreen/EventDetailScreen'; // Import Event Details Screen

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      
      setUser(authUser); // Update user state when logged in or logged out
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Home" : "Login"}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegistrationScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="EventList" component={EventListScreen} />
            <Stack.Screen name="EventDetails" component={EventDetailScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
