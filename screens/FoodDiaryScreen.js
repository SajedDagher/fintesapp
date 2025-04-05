import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

const FoodDiaryScreen = ({ navigation }) => {
  const [foodLog, setFoodLog] = useState({ Breakfast: [], Lunch: [], Dinner: [], Snacks: [] });

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

      fetchFoodLogs();
    }, [])
  );

  const updateDailyCalories = async (caloriesChange) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
  
      const today = new Date().toISOString().split('T')[0];
      const dailyStatsRef = doc(db, 'dailyStats', `${userId}_${today}`);
  
      // Get current stats or initialize if doesn't exist
      const docSnap = await getDoc(dailyStatsRef);
      const currentData = docSnap.exists() ? docSnap.data() : { calories: 0, steps: 0 };
      const newCalories = (currentData.calories || 0) + caloriesChange;
  
      // Make sure we don't go negative
      await setDoc(dailyStatsRef, { 
        ...currentData,
        calories: Math.max(0, newCalories) 
      }, { merge: true });
    } catch (error) {
      console.error('Error updating calories:', error);
      Alert.alert('Error', 'Failed to update calorie count');
    }
  };
  
  // Modify your deleteFoodLog function to ensure it passes calories:
  const deleteFoodLog = async (foodId, mealType, calories) => {
    try {
      await deleteDoc(doc(db, 'foodLogs', foodId));
      
      setFoodLog(prev => ({
        ...prev,
        [mealType]: prev[mealType].filter(food => food.id !== foodId),
      }));
  
      // Pass negative value to subtract calories
      await updateDailyCalories(-calories);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete food log');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
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
          </View>
        ))}
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
  emptyMealText: { color: '#666', textAlign: 'center', marginTop: 10 }
});

export default FoodDiaryScreen;
