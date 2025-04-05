import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

const WORKOUT_TYPES = ['Cardio', 'Strength', 'Flexibility', 'HIIT'];

const WorkoutDiaryScreen = ({ navigation }) => {
  const [workouts, setWorkouts] = useState([]);
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);

  useFocusEffect(
    useCallback(() => {
      const fetchWorkouts = async () => {
        try {
          const userId = auth.currentUser?.uid;
          if (!userId) return;

          const q = query(
            collection(db, 'workouts'),
            where('userId', '==', userId),
            where('date', '==', selectedDate)
          );

          const querySnapshot = await getDocs(q);
          const workoutData = [];

          querySnapshot.forEach(doc => {
            workoutData.push({ id: doc.id, ...doc.data() });
          });

          setWorkouts(workoutData);
        } catch (error) {
          Alert.alert('Error', 'Failed to load workouts');
        }
      };

      fetchWorkouts();
    }, [selectedDate])
  );

  const deleteWorkout = async (workoutId) => {
    try {
      await deleteDoc(doc(db, 'workouts', workoutId));
      setWorkouts(prev => prev.filter(workout => workout.id !== workoutId));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete workout');
    }
  };

  const addWorkout = async (workoutType) => {
    navigation.navigate('WorkoutLog', { workoutType });
  };

  const renderWorkoutItem = ({ item }) => (
    <View style={styles.workoutItem}>
      <View style={styles.workoutInfo}>
        <Text style={styles.workoutName}>{item.name}</Text>
        <Text style={styles.workoutDetails}>
          {item.duration} min • {item.caloriesBurned} kcal
        </Text>
        {item.sets && (
          <Text style={styles.workoutDetails}>
            {item.sets} sets × {item.reps} reps {item.weight ? `× ${item.weight} kg` : ''}
          </Text>
        )}
      </View>
      <TouchableOpacity onPress={() => deleteWorkout(item.id)}>
        <Icon name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Today's Workouts</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('WorkoutType')}
          >
            <Icon name="add" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {workouts.length === 0 ? (
          <Text style={styles.emptyText}>No workouts logged today</Text>
        ) : (
          <FlatList
            data={workouts}
            renderItem={renderWorkoutItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        )}

        <View style={styles.workoutTypesContainer}>
          {WORKOUT_TYPES.map(type => (
            <TouchableOpacity
              key={type}
              style={styles.workoutTypeCard}
              onPress={() => addWorkout(type)}
            >
              <Text style={styles.workoutTypeText}>{type}</Text>
              <Icon name="add-circle-outline" size={28} color="#007AFF" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#2D2D2D',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  workoutItem: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  workoutDetails: {
    color: '#666',
    fontSize: 14,
  },
  workoutTypesContainer: {
    marginTop: 20,
  },
  workoutTypeCard: {
    backgroundColor: '#FF9E9E',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutTypeText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default WorkoutDiaryScreen;