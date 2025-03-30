import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch } from 'react-native';

const HeightWeightScreen = ({ navigation, route }) => {
  const { name, email, uid, age, gender } = route.params; // Data passed from UserInfoScreen
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [isMetric, setIsMetric] = useState(true);

  const handleNext = () => {
    // Validate inputs
    if (!height || !weight) {
      alert('Please fill out all fields.');
      return;
    }

    // Navigate to the next screen and pass data
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
      <View style={styles.toggleContainer}>
        <Text>Metric (kg/cm)</Text>
        <Switch
          value={isMetric}
          onValueChange={(value) => setIsMetric(value)}
        />
        <Text>Imperial (lbs/ft)</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder={isMetric ? 'Height (cm)' : 'Height (ft)'}
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder={isMetric ? 'Weight (kg)' : 'Weight (lbs)'}
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
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
  input: {
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
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});

export default HeightWeightScreen;