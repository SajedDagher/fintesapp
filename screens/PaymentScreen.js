import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { collection, query, where, getDocs, updateDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';


const PaymentScreen = () => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [paypalEmail, setPaypalEmail] = useState('');
  const [upiId, setUpiId] = useState('');

  const route = useRoute();
  const { uid, planId } = route.params;

  const handleConfirm = async () => {
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }
  
    try {
      const userQuery = query(collection(db, 'users'), where('uid', '==', uid));
      const snapshot = await getDocs(userQuery);
  
      const userData = {
        isPremium: true,
        premiumPlan: planId,
        paymentMethod: selectedMethod,
        upgradedAt: new Date(),
      };
  
      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        await updateDoc(doc(db, 'users', userDoc.id), userData);
      } else {
        await addDoc(collection(db, 'users'), {
          uid,
          ...userData,
          createdAt: new Date()
        });
      }
  
      alert(`🎉 Premium activated via ${selectedMethod.toUpperCase()} for plan: ${planId}`);
      console.log("Updated user with UID:", uid);
  
    } catch (error) {
      console.error('Error updating user premium status:', error);
      alert('❌ Failed to activate premium. Please try again.');
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Payment Method</Text>

      {/* Radio buttons */}
      {['card', 'paypal', 'upi'].map(method => (
        <TouchableOpacity
          key={method}
          style={styles.radioContainer}
          onPress={() => setSelectedMethod(method)}
        >
          <View style={[styles.radio, selectedMethod === method && styles.radioSelected]} />
          <Text style={styles.radioLabel}>
            {method === 'card' ? 'Credit/Debit Card' : method === 'paypal' ? 'PayPal' : 'UPI'}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Dynamic inputs */}
      {selectedMethod === 'card' && (
        <View style={styles.inputGroup}>
          <TextInput style={styles.input} placeholder="Card Number" onChangeText={(text) => setCardDetails({ ...cardDetails, number: text })} />
          <TextInput style={styles.input} placeholder="Expiry Date" onChangeText={(text) => setCardDetails({ ...cardDetails, expiry: text })} />
          <TextInput style={styles.input} placeholder="CVV" secureTextEntry onChangeText={(text) => setCardDetails({ ...cardDetails, cvv: text })} />
        </View>
      )}
      {selectedMethod === 'paypal' && (
        <TextInput style={styles.input} placeholder="PayPal Email" onChangeText={setPaypalEmail} />
      )}
      {selectedMethod === 'upi' && (
        <TextInput style={styles.input} placeholder="UPI ID" onChangeText={setUpiId} />
      )}

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} disabled={!selectedMethod}>
        <Text style={styles.confirmText}>Confirm & Upgrade</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 20, textAlign: 'center' },
  radioContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#FFF', marginRight: 10 },
  radioSelected: { backgroundColor: '#FF9E9E' },
  radioLabel: { color: '#FFF', fontSize: 16 },
  inputGroup: { marginTop: 10 },
  input: {
    backgroundColor: '#2A2A2A',
    color: '#FFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#444',
  },
  confirmButton: {
    backgroundColor: '#FF9E9E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});

export default PaymentScreen;
