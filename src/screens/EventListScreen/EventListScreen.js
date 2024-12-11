import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button } from "react-native";
import { db } from "../../firebase/config"; // Ensure this is your Firebase config
import { collection, getDocs } from "firebase/firestore";

const EventListScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);

  // Fetch events from Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsData);
    };

    fetchEvents();
  }, []);

  // Render each event item
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.eventContainer}
      onPress={() => navigation.navigate("EventDetails", { eventId: item.id })}
    >
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDescription}>{item.description}</Text>
      <Text style={styles.eventDate}>
        {new Date(item.date.seconds * 1000).toLocaleString()}
      </Text>
      <Text style={styles.attendeesTitle}>Attendees:</Text>
      {item.attendees && item.attendees.length > 0 ? (
        item.attendees.map((attendee, index) => (
          <View key={index} style={styles.attendeeContainer}>
            <Text style={styles.attendeeInfo}>
              {attendee.userId}: {attendee.status.charAt(0).toUpperCase() + attendee.status.slice(1)}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.noAttendees}>No attendees</Text>
      )}
    </TouchableOpacity>
  );

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
      {/* Add Event Button */}
      <TouchableOpacity
        style={styles.addEventButton}
        onPress={() => navigation.navigate("AddEvent")}
      >
        <Text style={styles.addEventButtonText}>Add Event</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  eventContainer: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  eventTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  eventDescription: { fontSize: 14, color: "#555" },
  eventDate: { fontSize: 12, color: "#888", marginTop: 5 },
  attendeesTitle: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  attendeeContainer: { marginLeft: 10 },
  attendeeInfo: { fontSize: 14, color: "#444" },
  noAttendees: { fontSize: 14, color: "#888", fontStyle: "italic" },
  addEventButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    marginTop: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  addEventButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EventListScreen;
