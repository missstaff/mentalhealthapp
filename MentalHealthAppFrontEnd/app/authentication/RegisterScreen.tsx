import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { register } from '../../api/auth';
import { router } from 'expo-router';
import { useAuth } from '../AuthContext';
import { useThemeContext } from '@/components/ThemeContext';

export default function RegisterScreen() {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const { setIsAuthenticated } = useAuth();

  const validatePassword = (pass: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(pass);
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        'Error',
        'Password must be at least 8 characters long and include at least one letter and one number'
      );
      return;
    }

    try {
      const response = await register(name, email, password);
      if (response) {
        setIsAuthenticated(true);
        Alert.alert('Success', 'User registered successfully');
        router.replace('/home');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleGoBack = () => {
    router.replace('/login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Create Account</Text>
      <TextInput
        placeholder="Display Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        secureTextEntry
      />
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Text style={styles.backButtonText}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const createStyles = (theme: string) => {
  const isDark = theme === 'dark';
  return StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingHorizontal: 30,
      paddingTop: 80,
      backgroundColor: isDark ? '#121212' : '#f7f7f7',
      alignItems: 'center',
    },
    headerText: {
      fontSize: 32,
      fontWeight: '600',
      marginBottom: 40,
      color: isDark ? '#e0e0e0' : '#333',
    },
    input: {
      width: '100%',
      padding: 15,
      marginVertical: 10,
      backgroundColor: isDark ? '#333333' : '#ffffff',
      borderRadius: 8,
      fontSize: 16,
      borderColor: isDark ? '#444444' : '#ddd',
      borderWidth: 1,
      color: isDark ? '#e0e0e0' : '#000',
    },
    registerButton: {
      backgroundColor: isDark ? '#388e3c' : '#4e9c81',
      paddingVertical: 15,
      borderRadius: 8,
      alignItems: 'center',
      width: '100%',
      marginTop: 30,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
    },
    backButton: {
      alignItems: 'center',
      marginTop: 20,
    },
    backButtonText: {
      color: isDark ? '#81c784' : '#4e9c81',
      fontSize: 16,
      textDecorationLine: 'underline',
    },
  });
};
