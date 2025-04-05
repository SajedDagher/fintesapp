import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { db } from '../firebaseConfig'; 
import { collection, addDoc } from 'firebase/firestore';

const GoalScreen = ({ navigation, route }) => {
  const { name, email, uid, age, gender, height, weight, lifestyle } = route.params; 
  const [goal, setGoal] = useState('');

  const goals = ['Lose Weight', 'Maintain Weight', 'Gain Weight'];

  const calculateFitness = (age, gender, height, weight, activityLevel, goal) => {
    // ... (keep your existing calculateFitness function exactly the same)
  };

  const handleSubmit = async () => {
    if (!goal) {
      alert('Please select a goal.');
      return;
    }

    const fitnessData = calculateFitness(age, gender, height, weight, lifestyle, goal);

    try {
      await addDoc(collection(db, 'users'), {
        uid: uid,
        name: name,
        email: email,
        age: age,
        gender: gender,
        height: height,
        weight: weight,
        lifestyle: lifestyle,
        goal: goal,
        calorieGoal: fitnessData.calorieGoal,
        protein: fitnessData.protein,
        carbs: fitnessData.carbs,
        fats: fitnessData.fats,
        stepGoal: fitnessData.stepGoal,
        createdAt: new Date(),
      });

      navigation.navigate('HomeScreen', { 
        fitnessData,
        name: name,
        userData: {
          initialWeight: weight,
          height: height,
          goal: goal
        }
      });
  
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to save data. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Goal</Text>
      
      {goals.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.card,
            goal === item && styles.activeCard,
          ]}
          onPress={() => setGoal(item)}
        >
          <Text style={[
            styles.cardText,
            goal === item && styles.activeCardText
          ]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
      
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Complete Setup</Text>
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
  submitButton: {
    backgroundColor: '#FF9E9E',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#1E1E1E',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default GoalScreen;