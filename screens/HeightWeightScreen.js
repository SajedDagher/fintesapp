import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';

const HeightWeightScreen = ({ navigation, route }) => {
  const { name, email, uid, age, gender } = route.params;
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [isMetric, setIsMetric] = useState(true);

  const handleNext = () => {
    if (!height || !weight) {
      alert('Please fill out all fields.');
      return;
    }

    navigation.navigate('Lifestyle', {
      name: name,
      email: email,
      uid: uid,
      age: age,
      gender: gender,
      height: height,
      weight: weight,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Body Metrics</Text>
      
      {/* New toggle design */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, isMetric && styles.activeToggle]}
          onPress={() => setIsMetric(true)}
        >
          <Text style={[styles.toggleText, isMetric && styles.activeToggleText]}>Metric (kg/cm)</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.toggleButton, !isMetric && styles.activeToggle]}
          onPress={() => setIsMetric(false)}
        >
          <Text style={[styles.toggleText, !isMetric && styles.activeToggleText]}>Imperial (lbs/ft)</Text>
        </TouchableOpacity>
      </View>
      
      <TextInput
        style={styles.input}
        placeholder={isMetric ? 'Height in cm' : 'Height in ft'}
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
        placeholderTextColor="#999"
      />
      
      <TextInput
        style={styles.input}
        placeholder={isMetric ? 'Weight in kg' : 'Weight in lbs'}
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        placeholderTextColor="#999"
      />
      
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
  input: {
    backgroundColor: '#2D2D2D',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    backgroundColor: '#2D2D2D',
    borderRadius: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: '#444',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#FF9E9E',
  },
  toggleText: {
    color: '#999',
    fontWeight: '500',
  },
  activeToggleText: {
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

export default HeightWeightScreen;