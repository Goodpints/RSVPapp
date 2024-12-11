import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/LoginScreen/LoginScreen";
import RegistrationScreen from "./src/screens/RegistrationScreen/RegistrationScreen";
import HomeScreen from "./src/screens/HomeScreen/HomeScreen";
import EventListScreen from "./src/screens/EventListScreen/EventListScreen";
import EventDetailScreen from "./src/screens/EventDetailScreen/EventDetailScreen";

import { auth } from "./src/firebase/config"; // Import Firebase Auth

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser); // Set user state
    });

    return unsubscribe; // Cleanup the listener
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
