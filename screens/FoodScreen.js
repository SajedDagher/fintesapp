import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, 
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';

const FoodScreen = ({ route, navigation }) => {
  const { food, mealType = 'Lunch' } = route.params;
  const [serving, setServing] = useState(100);

  const updateDailyCalories = async (calories) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const today = new Date().toISOString().split('T')[0];
      const dailyStatsRef = doc(db, 'dailyStats', `${userId}_${today}`);

      const docSnap = await getDoc(dailyStatsRef);
      const currentData = docSnap.exists() ? docSnap.data() : { calories: 0, steps: 0 };
      const newCalories = (currentData.calories || 0) + calories;

      await setDoc(dailyStatsRef, { 
        ...currentData,
        calories: Math.max(0, newCalories) 
      }, { merge: true });
    } catch (error) {
      console.error('Error updating calories:', error);
    }
  };

  const addFood = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const calories = (food.calories * serving / 100).toFixed(2);
      
      await addDoc(collection(db, 'foodLogs'), {
        userId,
        name: food.description,
        calories: parseFloat(calories),
        protein: food.protein ? (food.protein * serving / 100).toFixed(2) : 0,
        carbs: food.carbs ? (food.carbs * serving / 100).toFixed(2) : 0,
        fat: food.fat ? (food.fat * serving / 100).toFixed(2) : 0,
        amount: `${serving}g`,
        mealType,
        date: today,
        createdAt: new Date()
      });

      await updateDailyCalories(parseFloat(calories));
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to add food item');
      console.error('Error adding food:', error);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.foodHeader}>
            <Text style={styles.foodName}>{food.description}</Text>
            <Text style={styles.foodDetails}>Nutrition per 100g</Text>
          </View>

          <View style={styles.nutritionContainer}>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionLabel}>Calories</Text>
              <Text style={styles.nutritionValue}>{food.calories || 0} kcal</Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionLabel}>Protein</Text>
              <Text style={styles.nutritionValue}>{food.protein || 0}g</Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionLabel}>Carbs</Text>
              <Text style={styles.nutritionValue}>{food.carbs || 0}g</Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionLabel}>Fat</Text>
              <Text style={styles.nutritionValue}>{food.fat || 0}g</Text>
            </View>
          </View>

          <View style={styles.servingContainer}>
            <Text style={styles.servingLabel}>Serving Size (grams)</Text>
            <TextInput
              style={styles.servingInput}
              keyboardType="numeric"
              value={String(serving)}
              onChangeText={(value) => {
                const num = parseInt(value);
                if (!isNaN(num) && num > 0) setServing(num);
              }}
            />
          </View>

          <View style={styles.adjustedNutrition}>
            <Text style={styles.adjustedTitle}>For {serving}g serving:</Text>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionLabel}>Calories</Text>
              <Text style={styles.nutritionValue}>
                {((food.calories || 0) * serving / 100).toFixed(2)} kcal
              </Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionLabel}>Protein</Text>
              <Text style={styles.nutritionValue}>
                {((food.protein || 0) * serving / 100).toFixed(2)}g
              </Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionLabel}>Carbs</Text>
              <Text style={styles.nutritionValue}>
                {((food.carbs || 0) * serving / 100).toFixed(2)}g
              </Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionLabel}>Fat</Text>
              <Text style={styles.nutritionValue}>
                {((food.fat || 0) * serving / 100).toFixed(2)}g
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.addButton} onPress={addFood}>
            <Text style={styles.addButtonText}>Add to {mealType}</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2D2D2D' },
  innerContainer: { flex: 1, padding: 20, justifyContent: 'center' },
  foodHeader: { marginBottom: 20 },
  foodName: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  foodDetails: { fontSize: 14, color: '#AAA', marginTop: 4 },
  nutritionContainer: { backgroundColor: '#FFF', borderRadius: 10, padding: 16, marginBottom: 20 },
  nutritionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  nutritionLabel: { fontSize: 16, color: '#555' },
  nutritionValue: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  servingContainer: { backgroundColor: '#FFF', borderRadius: 10, padding: 16, marginBottom: 20 },
  servingLabel: { fontSize: 16, marginBottom: 10, color: '#555' },
  servingInput: {
    backgroundColor: '#F5F5F5',
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    textAlign: 'center',
  },
  adjustedNutrition: { backgroundColor: '#FFF', borderRadius: 10, padding: 16, marginBottom: 20 },
  adjustedTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  addButton: { backgroundColor: '#FF9E9E', padding: 16, borderRadius: 10, alignItems: 'center' },
  addButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

export default FoodScreen;
