import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { db } from "../../firebase/config"; // Ensure this is your Firebase config
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Picker } from '@react-native-picker/picker'; // Corrected import

const EventDetailScreen = ({ route }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      const docRef = doc(db, "events", eventId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setEvent(data);
        setAttendees(data.attendees || []);
      } else {
        console.log("No such document!");
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const updateStatus = async (userId, newStatus) => {
    const updatedAttendees = attendees.map((attendee) =>
      attendee.userId === userId ? { ...attendee, status: newStatus } : attendee
    );
    setAttendees(updatedAttendees);

    // Update Firestore
    const docRef = doc(db, "events", eventId);
    await updateDoc(docRef, {
      attendees: updatedAttendees,
    });
  };

  return (
    <View style={styles.container}>
      {event ? (
        <>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.description}>{event.description}</Text>
          <Text style={styles.date}>{new Date(event.date.seconds * 1000).toLocaleString()}</Text>

          <Text style={styles.subtitle}>Attendees:</Text>
          {attendees.map((attendee) => (
            <View key={attendee.userId} style={styles.attendeeContainer}>
              <Text>{attendee.userId}</Text>
              <Picker
                selectedValue={attendee.status}
                style={styles.picker}
                onValueChange={(value) => updateStatus(attendee.userId, value)}
              >
                <Picker.Item label="Pending" value="pending" />
                <Picker.Item label="Yes" value="yes" />
                <Picker.Item label="No" value="no" />
                <Picker.Item label="Maybe" value="maybe" />
              </Picker>
            </View>
          ))}
        </>
      ) : (
        <Text>Loading event details...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold" },
  description: { fontSize: 16, marginTop: 10 },
  date: { fontSize: 14, marginTop: 5, color: "gray" },
  subtitle: { fontSize: 18, marginTop: 20, fontWeight: "bold" },
  attendeeContainer: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  picker: { flex: 1, marginLeft: 10, height: 40 },
});

export default EventDetailScreen;
