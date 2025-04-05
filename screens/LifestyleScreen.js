import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const LifestyleScreen = ({ navigation, route }) => {
  const { name, email, uid, age, gender, height, weight } = route.params;
  const [lifestyle, setLifestyle] = useState('');

  const lifestyles = [
    'Sedentary',
    'Lightly Active',
    'Moderately Active',
    'Very Active',
    'Extra Active',
  ];

  const handleNext = () => {
    if (!lifestyle) {
      alert('Please select a lifestyle.');
      return;
    }

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
            lifestyle === item && styles.activeCard,
          ]}
          onPress={() => setLifestyle(item)}
        >
          <Text style={[
            styles.cardText,
            lifestyle === item && styles.activeCardText
          ]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
      
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1E1E1E',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#2D2D2D',
    padding: 18,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#444',
  },
  activeCard: {
    backgroundColor: '#FF9E9E',
    borderColor: '#FF9E9E',
  },
  cardText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  activeCardText: {
    color: '#1E1E1E',
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#FF9E9E',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  nextButtonText: {
    color: '#1E1E1E',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LifestyleScreen;