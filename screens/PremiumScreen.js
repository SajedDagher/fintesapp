import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';


const PremiumScreen = () => {
  const [selectedPlan, setSelectedPlan] = useState('annual');
  const navigation = useNavigation();
  const auth = getAuth(); // Initialize auth
  const currentUser = auth.currentUser;

  const plans = [
    { id: 'monthly', name: 'Monthly', price: '$9.99', perMonth: '$9.99/month' },
    { id: '6month', name: '6-Month Bundle', price: '$49.99', perMonth: '$8.33/month', savings: '17% savings' },
    { id: 'annual', name: 'Annual', price: '$79.99', perMonth: '$6.66/month', savings: '33% savings + 1 bonus month', bestValue: true },
  ];

  const handleUpgrade = (planId) => {
    if (currentUser) {
      navigation.navigate('PaymentScreen', { uid: currentUser.uid, planId });
    } else {
      alert("User not authenticated.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Go Premium</Text>
        <Text style={styles.subtitle}>No ads + Access to advanced features</Text>

        <View style={styles.featuresContainer}>
          <Text style={styles.feature}>📸 AI Camera Meal Analysis</Text>
          <Text style={styles.feature}>� Barcode Scanning</Text>
          <Text style={styles.feature}>📊 Advanced Nutrition Analytics</Text>
          <Text style={styles.feature}>🧠 Smart Meal Suggestions</Text>
        </View>

        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[styles.planCard, selectedPlan === plan.id && styles.selectedPlanCard]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              {plan.bestValue && <Text style={styles.bestValueBadge}>BEST VALUE</Text>}
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>{plan.price}</Text>
              <Text style={styles.planPerMonth}>{plan.perMonth}</Text>
              {plan.savings && <Text style={styles.planSavings}>{plan.savings}</Text>}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.upgradeButton} onPress={() => handleUpgrade(selectedPlan)}>
          <Text style={styles.upgradeButtonText}>UPGRADE NOW</Text>
        </TouchableOpacity>

        <Text style={styles.securityText}>🔒 Secure payment • Cancel anytime</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  container: { flex: 1, padding: 20, backgroundColor: '#1A1A1A', paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#A0A0A0', textAlign: 'center', marginBottom: 30 },
  featuresContainer: { marginBottom: 30 },
  feature: { fontSize: 16, color: '#E0E0E0', marginBottom: 12 },
  plansContainer: { marginBottom: 30 },
  planCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#333',
  },
  selectedPlanCard: {
    borderColor: '#FF9E9E',
    backgroundColor: '#2D2D2D',
  },
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    right: 15,
    backgroundColor: '#FF9E9E',
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 'bold',
  },
  planName: { fontSize: 18, fontWeight: '600', color: '#FFF' },
  planPrice: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginVertical: 5 },
  planPerMonth: { fontSize: 14, color: '#A0A0A0' },
  planSavings: { fontSize: 14, color: '#FF9E9E', marginTop: 5 },
  upgradeButton: {
    backgroundColor: '#FF9E9E',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  upgradeButtonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  securityText: { textAlign: 'center', color: '#A0A0A0', fontSize: 14 },
});

export default PremiumScreen;
