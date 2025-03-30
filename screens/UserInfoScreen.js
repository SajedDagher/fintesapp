import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const UserInfoScreen = ({ navigation, route }) => {
  const { name, email, uid } = route.params; // Data passed from SignUpScreen
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  const handleNext = () => {
    // Validate inputs (optional but recommended)
    if (!name || !age || !gender) {
      alert('Please fill out all fields.');
      return;
    }

    // Navigate to the next screen and pass data
    navigation.navigate('HeightWeight', {
      name: name,
      email: email,
      uid: uid,
      age: age,
      gender: gender,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tell Us About Yourself</Text>
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <Picker
        selectedValue={gender}
        style={styles.picker}
        onValueChange={(itemValue) => setGender(itemValue)}
      >
        <Picker.Item label="Select Gender" value="" />
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
        <Picker.Item label="Other" value="Other" />
      </Picker>
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
  picker: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default UserInfoScreen;