import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";

const EventListScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsSnapshot = await firestore().collection("events").get();
        const eventsList = eventsSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        setEvents(eventsList);
        setLoading(false);
      } catch (err) {
        setError("Failed to load events");
        setLoading(false);
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  const handleEventPress = (eventId) => {
    navigation.navigate("EventDetail", { eventId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.eventItem} onPress={() => handleEventPress(item.id)}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text>{item.description}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Event List</Text>
      {events.length === 0 ? (
        <Text>No events available</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
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
    marginBottom: 20,
  },
  eventItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  eventTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default EventListScreen;
