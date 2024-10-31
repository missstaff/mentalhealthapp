
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView, Linking } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { hasSubmittedDailyCheckin } from "@/api/checkin";
import { getCurrentUser, signout } from "@/api/auth";
import { getPersonalizedInsights } from "@/api/insights";
import { insightModel } from "@/models/insightModel";
import { useAuth } from "../AuthContext";
import { useRouter } from "expo-router";
import { useThemeContext } from "@/components/ThemeContext";
import { recommendedResourceModel } from "@/models/recommendedResourceModel";
import { getRecommendedResources } from "@/api/recommendedResources";

export default function HomeScreen() {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);
  
  const [user, setUser] = useState<any>(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<any>(null);
  const [resources, setResources] = useState<recommendedResourceModel[] | null>(null);
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const initialize = async () => {
      try {
        const user = await getCurrentUser();
        setUser(user);
        const checkedIn = await hasSubmittedDailyCheckin(user.uid);
        setHasCheckedIn(checkedIn);
        const insights = await getPersonalizedInsights(user.uid);
        setInsights(insights);
        const resources = await getRecommendedResources();
        setResources(resources);
      } catch (error) {
        console.error('Error initializing home screen:', error);
      } finally {
        setLoading(false);
      }
    };

  initialize();
}, []);

useEffect(() => {
  if (!isAuthenticated) {
    router.replace('/login');
  }
}, [isAuthenticated]);

const handleSignout = async () => {
  try {
    await signout();
    setUser(null);
    setIsAuthenticated(false);
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
      <Text style={styles.header}>Welcome Back, {user?.name ?? 'User'}!</Text>

      {user && !hasCheckedIn && (
        <View style={styles.card}>
          <Text style={styles.title}>Complete your daily check-in</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/dailycheckin')}
          >
            <Text style={styles.buttonText}>Go to Check-in</Text>
          </TouchableOpacity>
        </View>
      )}

{insights !== null && insights !== undefined && insights.length > 0 && (
  <View style={styles.card}>
    <Text style={styles.header}>Personalized Insights</Text>
    {insights.map((insight: insightModel, index: number) => (
      <View key={index} style={styles.reuseCard}>
        <View style={styles.cardIconContainer}>
          <Icon
            name={insight.icon}
            size={30}
          />
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{insight.title}</Text>
          <Text style={styles.cardCategory}>{insight.category}</Text>
          <Text style={styles.cardDescription}>{insight.description}</Text>
        </View>
      </View>
    ))}
  </View>
)}


{resources && resources.length > 0 ? (
  <View style={styles.card}>
    <Text style={styles.header}>Recommended Resources</Text>
    <Text style={styles.textSmall}>Tap to read more</Text>
    {resources.map((resource: recommendedResourceModel, index: number) => (
      <TouchableOpacity
        key={index}
        style={styles.reuseCard}
        onPress={() => Linking.openURL(resource.link)}
      >
        <View style={styles.cardIconContainer}>
          <Icon name={resource.icon} size={30} />
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.title}>{resource.title}</Text>
          <Text style={styles.cardCategory}>{resource.category}</Text>
          <Text style={styles.cardDescription}>{resource.description}</Text>
        </View>
      </TouchableOpacity>
    ))}
  </View>
) : (
  <Text style={styles.cardDescription}>No recommended resources available today.</Text>  // Provide fallback UI
)}


      <View style={styles.card}>
        <Text style={styles.title}>Crisis Support</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/crisis')}
        >
          <Text style={styles.buttonText}>Crisis Support</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Progress Overview</Text>
        <Text style={styles.contentText}>Your recent progress...</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handleSignout();
        }}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
}

const createStyles = (theme: string) => {
  const isDark = theme === 'dark';
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: isDark ? '#121212' : '#ffffff',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5',
    },
    loadingText: {
      fontSize: 18,
      color: isDark ? '#cccccc' : '#666',
    },
    header: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 12,
      color: isDark ? '#e0e0e0' : '#333',
      textAlign: 'center',
    },
    card: {
      backgroundColor: isDark ? '#1e1e1e' : '#fafafa',
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 8,
      color: isDark ? '#e0e0e0' : '#333',
    },
    contentText: {
      fontSize: 16,
      color: isDark ? '#bbbbbb' : '#666',
    },
    button: {
      backgroundColor: isDark ? '#005bb5' : '#007bff',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 12,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    reuseCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      marginBottom: 10,
      backgroundColor: isDark ? '#2b2b2b' : '#ffffff',
      borderRadius: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    cardIconContainer: {
      marginRight: 10,
    },
    cardTextContainer: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
      color: isDark ? '#e0e0e0' : '#333',
    },
    cardCategory: {
      fontSize: 14,
      color: isDark ? '#bbbbbb' : '#666',
      marginBottom: 5,
    },
    cardDescription: {
      fontSize: 14,
      color: isDark ? '#e0e0e0' : '#333',
    },
    textSmall: {
      fontSize: 12,
      color: isDark ? '#e0e0e0' : '#333',
      marginBottom: 4,
      textAlign: 'center',
    },
  });
};

