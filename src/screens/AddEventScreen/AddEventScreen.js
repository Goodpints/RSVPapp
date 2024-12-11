import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { db } from "../../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import DatePicker from "react-datepicker"; // Importing react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Importing styles for the date picker

const AddEventScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const currentUserId = "user2"; // Replace with actual user ID logic if available.

  const handleCreateEvent = async () => {
    if (!title || !description || !date) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      // Add event to the "events" collection in Firebase.
      await addDoc(collection(db, "events"), {
        title: title,
        description: description,
        createdBy: currentUserId,
        date: Timestamp.fromDate(date), // Converts date object to Firebase Timestamp.
        attendees: [
          {
            status: "pending",
            userId: "user1", // Replace with dynamic attendee logic if needed.
          },
        ],
      });

      Alert.alert("Success", "Event created successfully!");
      navigation.goBack(); // Navigate back to EventListScreen.
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert("Error", "Could not create event. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Event</Text>

      <TextInput
        style={styles.input}
        placeholder="Event Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Event Description"
        value={description}
        onChangeText={setDescription}
      />

      <View style={styles.pickerContainer}>
        <Text>Select Date</Text>
        <DatePicker
          selected={date}
          onChange={setDate} // Update the selected date
          dateFormat="yyyy/MM/dd"
          className="datepicker" // Optional styling class
        />
      </View>

      <Button title="Create Event" onPress={handleCreateEvent} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  pickerContainer: {
    marginBottom: 20,
  },
});

export default AddEventScreen;
