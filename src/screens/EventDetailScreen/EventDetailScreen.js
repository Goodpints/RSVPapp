import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const EventDetailScreen = ({ route }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventDoc = await firestore().collection('events').doc(eventId).get();
        if (eventDoc.exists) {
          setEvent(eventDoc.data());
        } else {
          Alert.alert('Error', 'Event not found');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        Alert.alert('Error', 'Could not fetch event details');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleRSVP = async (status) => {
    const userId = auth().currentUser?.uid;

    if (!userId) {
      Alert.alert('Error', 'You must be logged in to RSVP');
      return;
    }

    try {
      await firestore().collection('events').doc(eventId).update({
        attendees: firestore.FieldValue.arrayUnion({
          userId,
          status,
        }),
      });
      Alert.alert('Success', `You have RSVP'd: ${status}`);
    } catch (error) {
      console.error('Error updating RSVP:', error);
      Alert.alert('Error', 'Could not update RSVP status');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.center}>
        <Text>Event not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.description}>{event.description}</Text>
      <Text style={styles.date}>Date: {new Date(event.date.seconds * 1000).toDateString()}</Text>

      <Text style={styles.rsvpTitle}>RSVP:</Text>
      <Button title="Yes" onPress={() => handleRSVP('yes')} />
      <Button title="No" onPress={() => handleRSVP('no')} />
      <Button title="Maybe" onPress={() => handleRSVP('maybe')} />
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    marginVertical: 10,
    fontSize: 16,
  },
  date: {
    fontSize: 16,
    color: '#555',
  },
  rsvpTitle: {
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default EventDetailScreen;
