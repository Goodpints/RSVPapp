import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { auth } from '../../firebase/config';  // Correct path to config.js

const HomeScreen = ({ navigation }) => {
  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => navigation.replace("Login"))
      .catch((error) => alert(error.message));
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Screen!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
