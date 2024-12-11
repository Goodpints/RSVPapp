import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform } from "react-native";
import { db } from "../../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker"; // Native DateTimePicker for iOS/Android
import ReactDateTimePicker from 'react-datetime-picker'; // Web-compatible DateTimePicker

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
        <Text>Select Date and Time</Text>
        
        {/* Conditional rendering based on platform */}
        {Platform.OS === "web" ? (
          <ReactDateTimePicker
            onChange={setDate} // Update the date when the user selects it
            value={date} // The date to display in the picker
            format="y-MM-dd h:mm a" // Customize the format as per your needs
          />
        ) : (
          <DateTimePicker
            onChange={(event, selectedDate) => setDate(selectedDate || date)} // Update the date when the user selects it
            value={date} // The date to display in the picker
            mode="datetime" // Show both date and time
            display="default"
          />
        )}
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
