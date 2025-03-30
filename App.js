import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import Login from './screens/Login';
import SignUpScreen from './screens/SignUpScreen';
import UserInfoScreen from './screens/UserInfoScreen';
import HeightWeightScreen from './screens/HeightWeightScreen';
import LifestyleScreen from './screens/LifestyleScreen';
import GoalScreen from './screens/GoalScreen';
import HomeScreen from './screens/HomeScreen';
import FoodDiaryScreen from './screens/FoodDiaryScreen';
import WorkoutDiaryScreen from './screens/WorkoutDiaryScreen';
import ProgressScreen from './screens/ProgressScreen';
import PremiumScreen from './screens/PremiumScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="SplashScreen"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1A1A1A',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {/* Initial Screens */}
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        
        {/* Auth Flow */}
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ title: 'Sign In' }}
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUpScreen} 
          options={{ title: 'Create Account' }}
        />
        
        {/* Onboarding Flow */}
        <Stack.Screen 
          name="UserInfo" 
          component={UserInfoScreen} 
          options={{ title: 'Basic Information' }}
        />
        <Stack.Screen 
          name="HeightWeight" 
          component={HeightWeightScreen} 
          options={{ title: 'Body Metrics' }}
        />
        <Stack.Screen 
          name="Lifestyle" 
          component={LifestyleScreen} 
          options={{ title: 'Activity Level' }}
        />
        <Stack.Screen 
          name="Goal" 
          component={GoalScreen} 
          options={{ title: 'Set Your Goal' }}
        />
        
        {/* Main App Screens */}
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ 
            headerShown: false,
            gestureEnabled: false // Prevent swipe back to auth screens
          }}
        />
        
        {/* New Feature Screens */}
        <Stack.Screen 
          name="FoodDiary" 
          component={FoodDiaryScreen} 
          options={{ title: 'Food Diary' }}
        />
        <Stack.Screen 
          name="WorkoutDiary" 
          component={WorkoutDiaryScreen} 
          options={{ title: 'Workout Log' }}
        />
        <Stack.Screen 
          name="Progress" 
          component={ProgressScreen} 
          options={{ title: 'Your Progress' }}
        />
        <Stack.Screen 
          name="Premium" 
          component={PremiumScreen} 
          options={{ title: 'Go Premium' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;