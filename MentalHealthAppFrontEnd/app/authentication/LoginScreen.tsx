import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { login } from '../../api/auth';
import { hasSubmittedDailyCheckin } from '@/api/checkin';
import { useAuth } from '../AuthContext';
import { router } from 'expo-router';
import { useThemeContext } from '@/components/ThemeContext';
import ResetPasswordModal from '@/components/ResetPasswordModal';

export default function LoginScreen() {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsAuthenticated } = useAuth();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetModalVisible, setIsResetModalVisible] = useState(false);

  const validate = () => {
    let valid = true;

    // Simple email validation regex
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      valid = false;
    } else {
      setEmailError(null);
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError(null);
    }

    return valid;
  };

  const handleLogin = () => {
    if (!validate()) {
      return;
    }

    setIsLoading(true);

    login(email, password)
      .then((response) => {
        setIsAuthenticated(true);
        hasSubmittedDailyCheckin(response.uid).then((hasSubmitted) => {
          if (hasSubmitted) {
            router.replace('/home');
          } else {
            router.replace('/dailycheckin');
          }
        });
      })
      .catch((error: any) => {
        console.error('Login failed:', error);
        if (error instanceof Error) {
          Alert.alert('Login Error', error.message);
        } else {
          Alert.alert('Login Error', 'An unknown error occurred');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mental Health App Placeholder</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, emailError ? styles.errorInput : {}]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor="#aaa"
        />
        {emailError && <Text style={styles.errorText}>{emailError}</Text>}
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, passwordError ? styles.errorInput : { flex: 1 }]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            <Text style={styles.showHideText}>{isPasswordVisible ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
        {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          isLoading && styles.buttonDisabled,
        ]}
        onPress={handleLogin}
        disabled={isLoading}
        accessibilityLabel="Login"
        accessibilityHint="Press to log into your account"
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </Pressable>
      <Pressable
        style={styles.registerButton}
        onPress={() => router.replace('/register')}
        accessibilityLabel="Register"
        accessibilityHint="Press to create a new account"
      >
        <Text style={styles.registerButtonText}>Don't have an account? Register</Text>
      </Pressable>
      <Pressable onPress={() => setIsResetModalVisible(true)}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </Pressable>

      <ResetPasswordModal
        visible={isResetModalVisible}
        onClose={() => setIsResetModalVisible(false)}
      />
    </View>
  );
}

const createStyles = (theme: string) => {
  const isDark = theme === 'dark';
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: isDark ? '#121212' : '#ffffff',
      justifyContent: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: isDark ? '#bb86fc' : '#007aff',
      marginBottom: 40,
      textAlign: 'center',
    },
    inputContainer: {
      marginBottom: 20,
    },
    input: {
      height: 50,
      backgroundColor: isDark ? '#333333' : '#f2f2f2',
      paddingHorizontal: 15,
      borderRadius: 8,
      fontSize: 16,
      color: isDark ? '#e0e0e0' : '#333',
    },
    errorInput: {
      borderWidth: 1,
      borderColor: 'red',
    },
    errorText: {
      color: 'red',
      fontSize: 12,
      marginTop: 5,
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    showHideText: {
      color: isDark ? '#bb86fc' : '#007aff',
      marginLeft: 10,
      fontSize: 14,
      fontWeight: '600',
    },
    button: {
      height: 50,
      backgroundColor: isDark ? '#bb86fc' : '#007aff',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
    },
    buttonPressed: {
      backgroundColor: isDark ? '#8854d0' : '#005bb5',
    },
    buttonDisabled: {
      backgroundColor: isDark ? '#5a5a5a' : '#a0c4ff',
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    registerButton: {
      marginTop: 20,
      alignItems: 'center',
    },
    registerButtonText: {
      color: isDark ? '#bb86fc' : '#007aff',
      fontSize: 16,
      fontWeight: '600',
    },
    forgotPasswordText: {
      marginTop: 10,
      textAlign: 'center',
      color: isDark ? '#bb86fc' : '#007aff',
    },
  });
};
