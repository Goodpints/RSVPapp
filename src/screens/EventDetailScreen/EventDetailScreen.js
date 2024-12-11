import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

const EventDetailScreen = ({ route, navigation }) => {
  const eventId = route?.params?.eventId; // Safely access eventId
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        const docRef = doc(db, "events", eventId);
        const eventDoc = await getDoc(docRef);
        if (eventDoc.exists()) {
          setEvent(eventDoc.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (!eventId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Event not found!</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

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
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default EventDetailScreen;
