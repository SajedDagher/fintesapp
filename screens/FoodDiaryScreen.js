import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Button } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

const FoodDiaryScreen = ({ navigation, route }) => {
  const [foodLog, setFoodLog] = useState({ Breakfast: [], Lunch: [], Dinner: [], Snacks: [] });
  const [waterIntake, setWaterIntake] = useState(0);
  const { isPremium, fitnessData } = route.params || {};
  const calorieGoal = fitnessData?.calorieGoal || 2000;

  useFocusEffect(
    useCallback(() => {
      const fetchFoodLogs = async () => {
        try {
          const userId = auth.currentUser?.uid;
          if (!userId) return;

          const today = new Date().toISOString().split('T')[0];
          const q = query(
            collection(db, 'foodLogs'),
            where('userId', '==', userId),
            where('date', '==', today)
          );

          const querySnapshot = await getDocs(q);
          const logs = { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] };

          querySnapshot.forEach(doc => {
            const data = doc.data();
            logs[data.mealType].push({ id: doc.id, ...data });
          });

          setFoodLog(logs);
        } catch (error) {
          Alert.alert('Error', 'Failed to load food logs');
        }
      };

      const fetchWaterIntake = async () => {
        try {
          const userId = auth.currentUser?.uid;
          const today = new Date().toISOString().split('T')[0];
          const docRef = doc(db, 'dailyStats', `${userId}_${today}`);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setWaterIntake(data.waterIntake ?? 0);

            if (data.waterIntake === undefined) {
              await updateDoc(docRef, { waterIntake: 0 });
            }
          } else {
            await setDoc(docRef, { calories: 0, steps: 0, waterIntake: 0 });
          }
        } catch (e) {
          console.error('Error fetching water intake:', e);
        }
      };

      fetchFoodLogs();
      if (isPremium) fetchWaterIntake();
    }, [isPremium])
  );

  const updateDailyCalories = async (caloriesChange) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const today = new Date().toISOString().split('T')[0];
      const dailyStatsRef = doc(db, 'dailyStats', `${userId}_${today}`);
      const docSnap = await getDoc(dailyStatsRef);
      const currentData = docSnap.exists() ? docSnap.data() : { calories: 0, steps: 0 };
      const newCalories = (currentData.calories || 0) + caloriesChange;

      await setDoc(dailyStatsRef, {
        ...currentData,
        calories: Math.max(0, newCalories)
      }, { merge: true });
    } catch (error) {
      console.error('Error updating calories:', error);
      Alert.alert('Error', 'Failed to update calorie count');
    }
  };

  const updateWaterIntake = async (amount) => {
    try {
      const userId = auth.currentUser?.uid;
      const today = new Date().toISOString().split('T')[0];
      const dailyStatsRef = doc(db, 'dailyStats', `${userId}_${today}`);
      await updateDoc(dailyStatsRef, { waterIntake: waterIntake + amount });
      setWaterIntake(prev => prev + amount);
    } catch (e) {
      console.error('Failed to update water intake:', e);
    }
  };

  const deleteFoodLog = async (foodId, mealType, calories) => {
    try {
      await deleteDoc(doc(db, 'foodLogs', foodId));
      setFoodLog(prev => ({
        ...prev,
        [mealType]: prev[mealType].filter(food => food.id !== foodId),
      }));
      await updateDailyCalories(-calories);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete food log');
    }
  };

  const totalEaten = Object.values(foodLog).reduce((total, foods) => {
    return total + foods.reduce((sum, food) => sum + (food.calories || 0), 0);
  }, 0);

  const remaining = calorieGoal - totalEaten;

  const getSmartMealSuggestion = (mealType) => {
    const suggestions = {
      Breakfast: 'Try Greek yogurt with berries!',
      Lunch: 'Grilled chicken with quinoa!',
      Dinner: 'Baked salmon with spinach!',
      Snacks: 'Almonds or a protein bar!',
    };
    return suggestions[mealType];
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {isPremium && (
          <>
            <View style={styles.calorieSummary}>
              <Text style={styles.calorieText}>
                Goal: {calorieGoal} - Eaten: {totalEaten} = Left: {remaining}
              </Text>
            </View>
            <View style={styles.waterCard}>
              <Text style={styles.waterText}>Water Intake: {waterIntake} ml</Text>
              <View style={styles.waterButtons}>
                <Button title="+250ml" onPress={() => updateWaterIntake(250)} />
                <Button title="+500ml" onPress={() => updateWaterIntake(500)} />
              </View>
            </View>
          </>
        )}

        {MEAL_TYPES.map((meal) => (
          <View key={meal} style={styles.mealContainer}>
            <View style={styles.mealHeader}>
              <Text style={styles.mealTitle}>{meal}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('FoodSearch', { mealType: meal })}>
                <Icon name="add-circle-outline" size={28} color="#007AFF" />
              </TouchableOpacity>
            </View>
            {foodLog[meal].length === 0 ? (
              <Text style={styles.emptyMealText}>No foods logged yet</Text>
            ) : (
              foodLog[meal].map((item) => (
                <View key={item.id} style={styles.foodItem}>
                  <View>
                    <Text style={styles.foodName}>{item.name}</Text>
                    <Text style={styles.foodDetails}>{item.amount} - {item.calories} kcal</Text>
                  </View>
                  <TouchableOpacity onPress={() => deleteFoodLog(item.id, meal, item.calories)}>
                    <Icon name="delete" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              ))
            )}
            {isPremium && (
              <Text style={styles.suggestionText}>💡 {getSmartMealSuggestion(meal)}</Text>
            )}
          </View>
        ))}

        {isPremium && (
          <TouchableOpacity
            style={styles.recommendedCard}
            onPress={() => navigation.navigate('RecommendedMeal')}
          >
            <Text style={styles.recommendedTitle}>🍽️ AI Recommended Meal</Text>
            <Text style={styles.recommendedSubtitle}>Click to explore a meal tailored to your goal!</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#2D2D2D' },
  mealContainer: { backgroundColor: '#FF9E9E', padding: 16, marginBottom: 16, borderRadius: 10 },
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  mealTitle: { fontSize: 18, fontWeight: 'bold' },
  foodItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  foodName: { fontWeight: 'bold' },
  foodDetails: { color: '#666' },
  emptyMealText: { color: '#666', textAlign: 'center', marginTop: 10 },
  calorieSummary: { padding: 10, backgroundColor: '#4CAF50', borderRadius: 10, marginBottom: 20 },
  calorieText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
  suggestionText: { fontStyle: 'italic', marginTop: 10, color: '#333' },
  waterCard: { backgroundColor: '#80DEEA', padding: 16, borderRadius: 10, marginBottom: 20 },
  waterText: { color: '#003E4F', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  waterButtons: { flexDirection: 'row', justifyContent: 'space-around' },
  recommendedCard: {
    backgroundColor: '#FFD700',
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 30,
  },
  recommendedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  recommendedSubtitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  }
});

export default FoodDiaryScreen;
