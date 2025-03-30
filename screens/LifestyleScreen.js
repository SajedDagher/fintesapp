import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

const LifestyleScreen = ({ navigation, route }) => {
  const { name, email, uid, age, gender, height, weight } = route.params; // Data passed from HeightWeightScreen
  const [lifestyle, setLifestyle] = useState('');

  const lifestyles = [
    'Sedentary',
    'Lightly Active',
    'Moderately Active',
    'Very Active',
    'Extra Active',
  ];

  const handleNext = () => {
    // Validate inputs
    if (!lifestyle) {
      alert('Please select a lifestyle.');
      return;
    }

    // Navigate to the next screen and pass data
    navigation.navigate('Goal', {
      name: name,
      email: email,
      uid: uid,
      age: age,
      gender: gender,
      height: height,
      weight: weight,
      lifestyle: lifestyle,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Lifestyle</Text>
      {lifestyles.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.card,
            lifestyle === item && { backgroundColor: '#007AFF' },
          ]}
          onPress={() => setLifestyle(item)}
        >
          <Text style={[styles.cardText, lifestyle === item && { color: '#FFF' }]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
      <Button title="Next" onPress={handleNext} color="#007AFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    color: '#000',
  },
});

export default LifestyleScreen;