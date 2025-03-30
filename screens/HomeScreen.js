import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({ route, navigation }) => {
  const { fitnessData = {}, name = '', userData = {} } = route.params || {};

  const widgets = [
    {
      id: 1,
      title: 'Food Diary',
      icon: 'restaurant',
      color: '#FF9E9E',
      screen: 'FoodDiary'
    },
    {
      id: 2,
      title: 'Workout Diary',
      icon: 'fitness-center',
      color: '#A0E7E5',
      screen: 'WorkoutDiary'
    },
    {
      id: 3,
      title: 'Progress',
      icon: 'trending-up',
      color: '#B5EAD7',
      screen: 'Progress',
      params: { 
        initialWeight: userData.initialWeight,
        height: userData.height,
        goal: userData.goal
      }
    },
    {
      id: 4,
      title: 'Go Premium',
      icon: 'star',
      color: '#FFD700',
      screen: 'Premium'
    }
  ];

  const handleWidgetPress = (widget) => {
    navigation.navigate(widget.screen, widget.params || {});
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {name && <Text style={styles.userName}>{name}</Text>}

      <View style={[styles.widget, styles.calorieWidget]}>
        <Icon name="local-fire-department" size={24} color="#FF9E9E" />
        <Text style={styles.widgetLabel}>Calorie Goal</Text>
        <Text style={styles.calorieValue}>{fitnessData.calorieGoal || '0'} kcal</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.widget, styles.smallWidget]}>
          <Icon name="directions-walk" size={20} color="#A0E7E5" />
          <Text style={styles.widgetLabel}>Steps</Text>
          <Text style={styles.widgetValue}>{fitnessData.stepGoal || '0'}</Text>
        </View>

        <View style={[styles.widget, styles.smallWidget]}>
          <Icon name="restaurant" size={20} color="#B5EAD7" />
          <Text style={styles.widgetLabel}>Macros</Text>
          <View style={styles.macroGrid}>
            <Text style={styles.macroText}>P: {fitnessData.protein || '0'}g</Text>
            <Text style={styles.macroText}>C: {fitnessData.carbs || '0'}g</Text>
            <Text style={styles.macroText}>F: {fitnessData.fats || '0'}g</Text>
          </View>
        </View>
      </View>

      <View style={styles.row}>
        {widgets.slice(0, 2).map((widget) => (
          <TouchableOpacity 
            key={widget.id}
            style={[styles.widget, styles.smallWidget, { borderColor: widget.color }]}
            onPress={() => handleWidgetPress(widget)}
          >
            <Icon name={widget.icon} size={24} color={widget.color} />
            <Text style={[styles.widgetLabel, { color: widget.color }]}>
              {widget.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.row}>
        {widgets.slice(2, 4).map((widget) => (
          <TouchableOpacity 
            key={widget.id}
            style={[styles.widget, styles.smallWidget, { borderColor: widget.color }]}
            onPress={() => handleWidgetPress(widget)}
          >
            <Icon name={widget.icon} size={24} color={widget.color} />
            <Text style={[styles.widgetLabel, { color: widget.color }]}>
              {widget.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#1A1A1A',
    paddingTop: 24,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#F0F0F0',
    textAlign: 'center',
    marginVertical: 24,
  },
  widget: {
    backgroundColor: '#2D2D2D',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
    borderWidth: 2,
  },
  calorieWidget: {
    width: '100%',
    marginBottom: 16,
    borderColor: '#FF9E9E',
  },
  smallWidget: {
    width: '48%',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  widgetLabel: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 4,
    fontWeight: 'bold',
  },
  calorieValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF9E9E',
    marginTop: 4,
  },
  widgetValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#A0E7E5',
  },
  macroGrid: {
    marginTop: 4,
  },
  macroText: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    marginVertical: 2,
  },
});

export default HomeScreen;