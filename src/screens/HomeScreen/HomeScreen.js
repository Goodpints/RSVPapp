import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { auth } from "../../firebase/config"; // Correct path to config.js
import { signOut } from "firebase/auth"; // Import signOut method

const HomeScreen = ({ navigation }) => {
  // Handle user logout
  const handleLogout = () => {
    signOut(auth) // Use signOut with auth instance
      .then(() => navigation.replace("Login")) // Navigate back to the Login screen
      .catch((error) => alert(error.message));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RSVP ME</Text>

      {/* Navigate to Event List Screen */}
      <Button
        title="View Events"
        onPress={() => navigation.navigate("EventList")} // Adjust to your EventListScreen route name
      />

      {/* Logout Button */}
      <Button title="Logout" onPress={handleLogout} color="red" />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
