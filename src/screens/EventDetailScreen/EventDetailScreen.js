import React, { useState, useEffect } from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getAuth } from "firebase/auth";
import firestore from "@react-native-firebase/firestore";

const EventDetailScreen = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [response, setResponse] = useState(null);
  const currentUser = getAuth().currentUser;

  useEffect(() => {
    const fetchEvent = async () => {
      const eventDoc = await firestore().collection("events").doc(eventId).get();
      if (eventDoc.exists) {
        setEvent(eventDoc.data());
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleResponse = async (status) => {
    if (!currentUser) {
      Alert.alert("Error", "You need to be logged in to respond.");
      return;
    }

    const userResponse = {
      userId: currentUser.uid,
      status: status,
    };

    try {
      await firestore().collection("events").doc(eventId).update({
        attendees: firestore.FieldValue.arrayUnion(userResponse),  // Add response to attendees array
      });
      setResponse(status);
      Alert.alert("Success", `You responded with ${status}.`);
    } catch (error) {
      console.error("Error responding to event: ", error);
    }
  };

  if (!event) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <Text>{event.description}</Text>
      <Text>Date: {new Date(event.date.seconds * 1000).toDateString()}</Text>
      
      <Text style={styles.subtitle}>Your Response: {response || "Not Responded"}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleResponse("Yes")}>
          <Text style={styles.buttonText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleResponse("No")}>
          <Text style={styles.buttonText}>No</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleResponse("Maybe")}>
          <Text style={styles.buttonText}>Maybe</Text>
        </TouchableOpacity>
      </View>

      <Button title="Back to Events" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    width: "30%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default EventDetailScreen;
