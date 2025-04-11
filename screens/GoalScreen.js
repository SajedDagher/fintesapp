import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { db } from '../firebaseConfig'; 
import { collection, addDoc } from 'firebase/firestore';

const GoalScreen = ({ navigation, route }) => {
  const { name, email, uid, age, gender, height, weight, lifestyle } = route.params; 
  const [goal, setGoal] = useState('');

  const goals = ['Lose Weight', 'Maintain Weight', 'Gain Weight'];

  const calculateFitness = (age, gender, height, weight, activityLevel, goal) => {
     // 1. BMR Calculation (Mifflin-St Jeor)
     let BMR = gender === "male"
     ? 10 * weight + 6.25 * height - 5 * age + 5
     : 10 * weight + 6.25 * height - 5 * age - 161;

   // 2. Adjust for Activity Level (TDEE)
   const activityFactors = {
     Sedentary: 1.2,
     'Lightly Active': 1.375,
     'Moderately Active': 1.55,
     'Very Active': 1.725,
     'Super Active': 1.9
   };
   let TDEE = BMR * (activityFactors[activityLevel] || 1.2);

   // 3. Adjust Calories Based on Goal
   let calorieGoal = TDEE;
   if (goal === "Lose Weight") calorieGoal -= 500;
   if (goal === "Gain Weight") calorieGoal += 500;

   // 4. Calculate Macros
   const macroRatios = {
     "Lose Weight": { protein: 0.40, carbs: 0.40, fats: 0.20 },
     "Maintain Weight": { protein: 0.30, carbs: 0.50, fats: 0.20 },
     "Gain Weight": { protein: 0.35, carbs: 0.45, fats: 0.20 }
   };

   let macros = macroRatios[goal];
   let protein = Math.round((calorieGoal * macros.protein) / 4); // 4 kcal per gram
   let carbs = Math.round((calorieGoal * macros.carbs) / 4);
   let fats = Math.round((calorieGoal * macros.fats) / 9); // 9 kcal per gram

   // 5. Set Step Goal
   const stepGoals = {
     Sedentary: 5000,
     'Lightly Active': 7000,
     'Moderately Active': 9000,
     'Very Active': 11000,
     'Super Active': 13000
   };
   let stepGoal = stepGoals[activityLevel] || 5000;
   if (goal === "Lose Weight") stepGoal += 2000;

   return {
     calorieGoal: Math.round(calorieGoal),
     protein,
     carbs,
     fats,
     stepGoal
   };
 }

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