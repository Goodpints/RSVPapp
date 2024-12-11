import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const EventListScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('events')
      .orderBy('date', 'asc') // Order by date
      .onSnapshot((snapshot) => {
        const eventData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventData);
      });

    return unsubscribe; // Cleanup listener on unmount
  }, []);

  const renderEvent = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
    >
      <View style={{ padding: 20, borderBottomWidth: 1, borderColor: '#ccc' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
        <Text>{new Date(item.date.seconds * 1000).toDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={renderEvent}
    />
  );
};

export default EventListScreen;
