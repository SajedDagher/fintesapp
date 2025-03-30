import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Dimensions } from 'react-native';

const ProgressScreen = ({ route }) => {
  const { initialWeight, height, goal } = route.params || {};
  const [weightData, setWeightData] = useState([]);
  const [dates, setDates] = useState([]);
  const [newWeight, setNewWeight] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [bmi, setBmi] = useState(null);

  const screenWidth = Dimensions.get('window').width;

  function calculateBmi(weight, height) {
    if (!weight || !height) return null;
    const heightInM = height / 100;
    return (weight / (heightInM * heightInM)).toFixed(1);
  }

  useEffect(() => {
    const initializeData = () => {
      if (initialWeight) {
        const today = new Date().toISOString().split('T')[0];
        setWeightData([parseFloat(initialWeight)]);
        setDates([today]);
        setBmi(calculateBmi(initialWeight, height));
      }
    };

    const fetchWeightHistory = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const q = query(collection(db, 'weightHistory'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        const historyWeights = [];
        const historyDates = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          historyWeights.push(parseFloat(data.weight));
          historyDates.push(data.date);
        });

        // Combine with initial weight if it exists
        const allWeights = initialWeight 
          ? [parseFloat(initialWeight), ...historyWeights]
          : historyWeights;
          
        const allDates = initialWeight
          ? [new Date().toISOString().split('T')[0], ...historyDates]
          : historyDates;

        if (allWeights.length > 0) {
          setWeightData(allWeights);
          setDates(allDates);
          
          if (allWeights.length > 0 && height) {
            setBmi(calculateBmi(allWeights[allWeights.length - 1], height));
          }
        }
      } catch (error) {
        console.error('Error fetching weight history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
    fetchWeightHistory();
  }, [initialWeight, height]);

  // Format data for the chart
  const getChartData = () => {
    // Ensure we always have at least one data point
    const data = weightData.length > 0 ? weightData : initialWeight ? [parseFloat(initialWeight)] : [0];
    const labels = dates.length > 0 ? dates.map(date => date.split('-')[2]) : ['Today'];
    
    return {
      labels,
      datasets: [
        {
          data,
          color: (opacity = 1) => `rgba(255, 158, 158, ${opacity})`,
          strokeWidth: 2
        }
      ]
    };
  };

  const saveWeightEntry = async (weight) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const today = new Date().toISOString().split('T')[0];
      const weightNum = parseFloat(weight);
      
      await addDoc(collection(db, 'weightHistory'), {
        userId,
        weight: weightNum,
        date: today,
        createdAt: new Date()
      });

      // Update user's current weight
      const userQuery = query(collection(db, 'users'), where('uid', '==', userId));
      const userSnapshot = await getDocs(userQuery);
      
      if (!userSnapshot.empty) {
        await updateDoc(doc(db, 'users', userSnapshot.docs[0].id), {
          weight: weightNum
        });
      }

      return today;
    } catch (error) {
      console.error('Error saving weight entry:', error);
      return null;
    }
  };

  const handleAddWeight = async () => {
    if (!newWeight || isNaN(newWeight)) {
      alert('Please enter a valid weight');
      return;
    }
    
    const today = await saveWeightEntry(newWeight);
    if (!today) return;
    
    setWeightData([...weightData, parseFloat(newWeight)]);
    setDates([...dates, today]);
    setBmi(calculateBmi(parseFloat(newWeight), height));
    setNewWeight('');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9E9E" />
        <Text style={styles.loadingText}>Loading your progress...</Text>
      </View>
    );
  }

  const chartData = getChartData();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Progress Tracking</Text>
      
      <LineChart
        data={chartData}
        width={screenWidth - 32}
        height={220}
        yAxisSuffix=" kg"
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: '#2D2D2D',
          backgroundGradientFrom: '#2D2D2D',
          backgroundGradientTo: '#2D2D2D',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#FF9E9E'
          }
        }}
        bezier
        style={styles.chart}
      />

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Current Weight</Text>
          <Text style={styles.statValue}>
            {weightData.length > 0 ? weightData[weightData.length - 1] : initialWeight || '--'} kg
          </Text>
        </View>
        {bmi && (
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>BMI</Text>
            <Text style={styles.statValue}>{bmi}</Text>
          </View>
        )}
        {goal && (
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Goal</Text>
            <Text style={styles.statValue}>{goal}</Text>
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter new weight (kg)"
          placeholderTextColor="#AAAAAA"
          keyboardType="numeric"
          value={newWeight}
          onChangeText={setNewWeight}
        />
        <TouchableOpacity 
          style={[styles.button, !newWeight && styles.buttonDisabled]} 
          onPress={handleAddWeight}
          disabled={!newWeight}
        >
          <Text style={styles.buttonText}>Add Weight</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#1A1A1A',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  loadingText: {
    color: '#FF9E9E',
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  statBox: {
    backgroundColor: '#2D2D2D',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  statLabel: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  statValue: {
    color: '#FF9E9E',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  inputContainer: {
    marginTop: 20,
  },
  input: {
    backgroundColor: '#2D2D2D',
    color: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#FF9E9E',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    opacity: 1,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#1A1A1A',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noDataText: {
    color: '#AAAAAA',
    textAlign: 'center',
    marginVertical: 40,
  },
});

export default ProgressScreen;