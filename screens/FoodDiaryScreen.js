import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

const FoodDiaryScreen = () => {
  const [foodLog, setFoodLog] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: []
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMeal, setCurrentMeal] = useState('');
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [amount, setAmount] = useState('');

  // Load food logs from Firestore
  useEffect(() => {
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
          logs[data.mealType].push({
            id: doc.id,
            ...data
          });
        });

        setFoodLog(logs);
      } catch (error) {
        Alert.alert('Error', 'Failed to load food logs');
        console.error('Error loading food logs:', error);
      }
    };

    fetchFoodLogs();
  }, []);

  const addFoodItem = async () => {
    if (!foodName || !calories || !amount || !currentMeal) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      const newFood = {
        userId,
        name: foodName,
        calories: parseFloat(calories),
        amount: amount,
        mealType: currentMeal,
        date: today,
        createdAt: new Date()
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'foodLogs'), newFood);

      // Update local state
      setFoodLog(prev => ({
        ...prev,
        [currentMeal]: [...prev[currentMeal], { id: docRef.id, ...newFood }]
      }));

      // Reset form
      setFoodName('');
      setCalories('');
      setAmount('');
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to add food item');
      console.error('Error adding food:', error);
    }
  };

  const deleteFoodItem = async (mealType, id) => {
    try {
      await deleteDoc(doc(db, 'foodLogs', id));
      
      // Update local state
      setFoodLog(prev => ({
        ...prev,
        [mealType]: prev[mealType].filter(item => item.id !== id)
      }));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete food item');
      console.error('Error deleting food:', error);
    }
  };

  const calculateMealTotal = (mealType) => {
    return foodLog[mealType].reduce((total, item) => total + (item.calories || 0), 0);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {MEAL_TYPES.map((meal) => (
          <View key={meal} style={styles.mealContainer}>
            <View style={styles.mealHeader}>
              <Text style={styles.mealTitle}>{meal}</Text>
              <Text style={styles.mealTotal}>
                Total: {calculateMealTotal(meal)} kcal
              </Text>
            </View>

            {foodLog[meal].length === 0 ? (
              <Text style={styles.emptyMealText}>No foods logged yet</Text>
            ) : (
              foodLog[meal].map((item) => (
                <View key={item.id} style={styles.foodItem}>
                  <View style={styles.foodInfo}>
                    <Text style={styles.foodName}>{item.name}</Text>
                    <Text style={styles.foodDetails}>
                      {item.amount} - {item.calories} kcal
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => deleteFoodItem(meal, item.id)}
                    style={styles.deleteButton}
                  >
                    <Icon name="delete" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ))
            )}

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setCurrentMeal(meal);
                setModalVisible(true);
              }}
            >
              <Icon name="add" size={24} color="#007AFF" />
              <Text style={styles.addButtonText}>Add Food</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Add Food Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add to {currentMeal}</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Food Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Grilled Chicken"
              value={foodName}
              onChangeText={setFoodName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Serving Size</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 1 breast, 200g"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Calories</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 250"
              keyboardType="numeric"
              value={calories}
              onChangeText={setCalories}
            />
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={addFoodItem}
              disabled={!foodName || !calories || !amount}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  mealContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  mealTotal: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  emptyMealText: {
    color: '#999',
    textAlign: 'center',
    paddingVertical: 10,
    fontStyle: 'italic',
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  foodDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    backgroundColor: '#F0F7FF',
  },
  addButtonText: {
    color: '#007AFF',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F8F9FA',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F1F1F1',
    marginRight: 12,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    marginLeft: 12,
    opacity: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default FoodDiaryScreen;