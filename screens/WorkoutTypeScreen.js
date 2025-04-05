import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const WORKOUT_TYPES = [
  { name: 'Cardio', icon: 'directions-run' },
  { name: 'Strength', icon: 'fitness-center' },
  { name: 'Flexibility', icon: 'self-improvement' },
  { name: 'HIIT', icon: 'timer' },
  { name: 'Yoga', icon: 'self-improvement' },
  { name: 'Swimming', icon: 'pool' }
];

const WorkoutTypeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Workout Type</Text>
      <ScrollView contentContainerStyle={styles.typesContainer}>
        {WORKOUT_TYPES.map((type) => (
          <TouchableOpacity
            key={type.name}
            style={styles.typeCard}
            onPress={() => navigation.navigate('WorkoutLog', { workoutType: type.name })}
          >
            <Icon name={type.icon} size={30} color="#007AFF" />
            <Text style={styles.typeText}>{type.name}</Text>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  typesContainer: {
    paddingBottom: 20
  },
  typeCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  typeText: {
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
    marginLeft: 15
  }
});

export default WorkoutTypeScreen;