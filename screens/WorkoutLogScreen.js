import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Alert, KeyboardAvoidingView, Platform, ScrollView 
} from 'react-native';
import { db, auth } from '../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';


const WorkoutLogScreen = ({ route, navigation }) => {
  const { workoutType } = route.params;
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');

  const logWorkout = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const workoutData = {
        userId,
        name,
        type: workoutType,
        duration: parseInt(duration) || 0,
        caloriesBurned: parseInt(calories) || 0,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date(),
        notes
      };

      if (workoutType === 'Strength') {
        workoutData.sets = parseInt(sets) || 0;
        workoutData.reps = parseInt(reps) || 0;
        workoutData.weight = parseFloat(weight) || 0;
      }

      await addDoc(collection(db, 'workouts'), workoutData);
      navigation.navigate('WorkoutDiary');
    } catch (error) {
      Alert.alert('Error', 'Failed to log workout');
      console.error('Error logging workout:', error);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Log {workoutType} Workout</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Workout name*"
          value={name}
          onChangeText={setName}
        />
        
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Duration (min)*"
            keyboardType="numeric"
            value={duration}
            onChangeText={setDuration}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Calories*"
            keyboardType="numeric"
            value={calories}
            onChangeText={setCalories}
          />
        </View>

        {workoutType === 'Strength' && (
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.thirdInput]}
              placeholder="Sets"
              keyboardType="numeric"
              value={sets}
              onChangeText={setSets}
            />
            <TextInput
              style={[styles.input, styles.thirdInput]}
              placeholder="Reps"
              keyboardType="numeric"
              value={reps}
              onChangeText={setReps}
            />
            <TextInput
              style={[styles.input, styles.thirdInput]}
              placeholder="Weight (kg)"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
          </View>
        )}

        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Notes"
          multiline
          numberOfLines={3}
          value={notes}
          onChangeText={setNotes}
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={logWorkout}
          disabled={!name || !duration || !calories}
        >
          <Text style={styles.buttonText}>Save Workout</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D2D2D'
  },
  scrollContainer: {
    padding: 20
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  halfInput: {
    width: '48%'
  },
  thirdInput: {
    width: '31%'
  },
  button: {
    backgroundColor: '#FF9E9E',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default WorkoutLogScreen;