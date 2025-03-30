import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FoodDiaryScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>p Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    padding: 16,
  },
});

export default FoodDiaryScreen;