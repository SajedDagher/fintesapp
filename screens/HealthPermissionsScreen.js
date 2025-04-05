import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { initHealthKit } from '../healthService';
import { useNavigation } from '@react-navigation/native';

const HealthPermissionsScreen = () => {
  const navigation = useNavigation();

  const handleContinue = async () => {
    try {
      const authorized = await initHealthKit();
      if (authorized) {
        navigation.replace('HomeScreen');
      } else {
        // Handle case where user denied permissions
        navigation.replace('HomeScreen');
      }
    } catch (error) {
      console.error('Health permissions error:', error);
      navigation.replace('HomeScreen');
    }
  };

  return (
    <View style={styles.container}>
      <Icon name="favorite" size={80} color="#FF9E9E" style={styles.icon} />
      <Text style={styles.title}>Health Data Access</Text>
      <Text style={styles.subtitle}>
        To track your steps and activity, we need access to your health data.
        This helps us provide accurate fitness tracking.
      </Text>
      
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Grant Access</Text>
      </TouchableOpacity>
      
      {Platform.OS === 'ios' ? (
        <Text style={styles.note}>
          You'll be prompted to allow access to Apple Health. You can change this later in Settings.
        </Text>
      ) : (
        <Text style={styles.note}>
          You'll be asked to sign in with Google and grant access to Google Fit data.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  icon: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#FF9E9E',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 30,
  },
  buttonText: {
    color: '#1A1A1A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  note: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 30,
    lineHeight: 20,
  },
});

export default HealthPermissionsScreen;