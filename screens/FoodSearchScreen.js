import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet, ActivityIndicator } from 'react-native';

const API_KEY = 'lMK4uidUePxEle2PkcSPJwUbUjUISqnQcowwChae';
const BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

const FoodSearchScreen = ({ route, navigation }) => {
  const { mealType } = route.params;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchFoods = async () => {
    if (!query.trim()) {
      setError('Please enter a food name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${BASE_URL}/foods/search?api_key=${API_KEY}&query=${encodeURIComponent(query)}&pageSize=10`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.foods || data.foods.length === 0) {
        setError('No foods found. Try a different search term.');
        setResults([]);
      } else {
        const formattedFoods = data.foods.map(food => ({
          fdcId: food.fdcId,
          description: food.description,
          calories: food.foodNutrients?.find(n => n.nutrientName === 'Energy')?.value || 0,
          protein: food.foodNutrients?.find(n => n.nutrientName === 'Protein')?.value || 0,
          carbs: food.foodNutrients?.find(n => n.nutrientName === 'Carbohydrate, by difference')?.value || 0,
          fat: food.foodNutrients?.find(n => n.nutrientName === 'Total lipid (fat)')?.value || 0,
        }));

        setResults(formattedFoods);
      }
    } catch (error) {
      console.error('API Error:', error);
      setError('Failed to fetch foods. Please check your connection and try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const selectFood = (food) => {
    navigation.navigate('Food', { food, mealType });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for food..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            setError(null);
          }}
          onSubmitEditing={searchFoods}
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchFoods} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.searchButtonText}>Search</Text>}
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={results}
        keyExtractor={(item) => item.fdcId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.resultItem} onPress={() => selectFood(item)}>
            <Text style={styles.foodName}>{item.description}</Text>
            <Text style={styles.foodDetails}>
              {item.calories} kcal • P: {item.protein}g • C: {item.carbs}g • F: {item.fat}g
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#2D2D2D' },
  searchContainer: { flexDirection: 'row', marginBottom: 16 },
  searchInput: { flex: 1, backgroundColor: '#FFF', padding: 14, borderRadius: 10, fontSize: 16, borderWidth: 1, borderColor: '#DDD', color: '#333', marginRight: 10 },
  searchButton: { backgroundColor: '#FF9E9E', padding: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center', minWidth: 80 },
  searchButtonText: { color: '#fff', fontWeight: 'bold' },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 10 },
  resultItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#EEE', backgroundColor: '#FFF' },
  foodName: { fontWeight: 'bold', fontSize: 16 },
  foodDetails: { color: '#666', fontSize: 14 }
});

export default FoodSearchScreen;
