import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
import FoodSearchScreen from './screens/FoodSearchScreen';
import FoodScreen from './screens/FoodScreen';
import HealthPermissionsScreen from './screens/HealthPermissionsScreen';
import WorkoutTypeScreen from './screens/WorkoutTypeScreen';
import WorkoutLogScreen from './screens/WorkoutLogScreen';
import PaymentScreen from './screens/PaymentScreen';
import RecommendedMealScreen from './screens/RecommendedMealScreen';
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
          headerBackTitleVisible: false,
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
          options={{ title: 'Sign In', headerLeft: () => null }}
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
        
        {/* Health Permissions Screen */}
        {Platform.OS !== 'web' && (
          <Stack.Screen
            name="HealthPermissions"
            component={HealthPermissionsScreen}
            options={{ 
              title: 'Health Data Access',
              headerLeft: () => null
            }}
          />
        )}
        
        {/* Main App Screens */}
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ 
            headerShown: false,
            gestureEnabled: false
          }}
        />
        
        {/* Food Navigation */}
        <Stack.Screen 
          name="FoodDiary" 
          component={FoodDiaryScreen} 
          options={({ navigation }) => ({ 
            title: 'Food Diary',
            headerRight: () => (
              <Icon 
                name="add-circle-outline" 
                size={28} 
                color="#007AFF" 
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate('FoodSearch')}
              />
            )
          })} 
        />
        <Stack.Screen 
          name="FoodSearch" 
          component={FoodSearchScreen} 
          options={{ title: 'Search Food' }} 
        />
        <Stack.Screen 
          name="Food" 
          component={FoodScreen} 
          options={{ title: 'Food Details' }} 
        />
        
        {/* Other Screens */}
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
         <Stack.Screen 
    name="WorkoutType" 
    component={WorkoutTypeScreen} 
    options={{ title: 'Workout Type' }} 
  />
  <Stack.Screen 
    name="WorkoutLog" 
    component={WorkoutLogScreen} 
    options={({ route }) => ({ title: `Log ${route.params.workoutType}` })} 
  />
  <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
<Stack.Screen name="FoodScreen" component={FoodScreen} />
<Stack.Screen name="RecommendedMeal" component={RecommendedMealScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;