import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useThemeContext } from '@/components/ThemeContext'; // Access the theme context
import HomeScreen from './home';
import ProfileScreen from './profile';
import SettingsScreen from './settings';
import DailyCheckInScreen from './dailycheckin';
import { getCurrentUser } from '@/api/auth';
import { useAuth } from '../AuthContext';
import { Redirect } from 'expo-router';
import CrisisScreen from '../crisis/CrisisScreen';
import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { isAuthenticated } = useAuth();
  const { theme } = useThemeContext(); // Get the current theme from ThemeContext
  const isDark = theme === 'dark';

  // Define custom themes for the drawer
  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#121212',
      card: '#1e1e1e',
      text: '#ffffff',
    },
  };

  const CustomLightTheme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#f7f7f7',
      card: '#ffffff',
      text: '#000000',
    },
  };

  // Redirect to login if the user is not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? '#1e1e1e' : '#007BFF',
        },
        headerTintColor: isDark ? '#ffffff' : '#ffffff',
        drawerStyle: {
          backgroundColor: isDark ? '#121212' : '#ffffff',
        },
        drawerActiveTintColor: isDark ? '#bb86fc' : '#007BFF',
        drawerInactiveTintColor: isDark ? '#888' : '#555',
      }}
    >
      <Drawer.Screen name="home" component={HomeScreen} />
      <Drawer.Screen name="profile" component={ProfileScreen} />
      <Drawer.Screen name="settings" component={SettingsScreen} />
      <Drawer.Screen name="dailycheckin" component={DailyCheckInScreen} />
      <Drawer.Screen name="crisis" component={CrisisScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
