import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { getCurrentUser } from '../../api/auth';
import { submitCheckIn } from '../../api/checkin';
import { useRouter } from 'expo-router';
import { useThemeContext } from '@/components/ThemeContext';

export default function DailyCheckInScreen() {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);

  const [general, setGeneral] = useState('');
  const [notes, setNotes] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Dropdown state
  const [openStress, setOpenStress] = useState(false);
  const [stress, setStress] = useState(5);
  const [stressItems, setStressItems] = useState(
    [...Array(10)].map((_, i) => ({ label: `${i + 1}`, value: i + 1 }))
  );

  const [openMood, setOpenMood] = useState(false);
  const [mood, setMood] = useState(5);
  const [moodItems, setMoodItems] = useState([
    { label: '🤯', value: 1 },
    { label: '😡', value: 2 },
    { label: '😭', value: 3 },
    { label: '😢', value: 4 },
    { label: '😟', value: 5 },
    { label: '😕', value: 6 },
    { label: '😐', value: 7 },
    { label: '😌', value: 8 },
    { label: '😊', value: 9 },
    { label: '😃', value: 10 },
  ]);

  const [openSleep, setOpenSleep] = useState(false);
  const [sleep, setSleep] = useState(5);
  const [sleepItems, setSleepItems] = useState(
    [...Array(10)].map((_, i) => ({ label: `${i + 1}`, value: i + 1 }))
  );

  const [openActivity, setOpenActivity] = useState(false);
  const [activity, setActivity] = useState(5);
  const [activityItems, setActivityItems] = useState(
    [...Array(10)].map((_, i) => ({ label: `${i + 1}`, value: i + 1 }))
  );

  const onStressOpen = useCallback(() => {
    setOpenMood(false);
    setOpenSleep(false);
    setOpenActivity(false);
  }, []);

  const onMoodOpen = useCallback(() => {
    setOpenStress(false);
    setOpenSleep(false);
    setOpenActivity(false);
  }, []);

  const onSleepOpen = useCallback(() => {
    setOpenStress(false);
    setOpenMood(false);
    setOpenActivity(false);
  }, []);

  const onActivityOpen = useCallback(() => {
    setOpenStress(false);
    setOpenMood(false);
    setOpenSleep(false);
  }, []);

  useEffect(() => {
    getCurrentUser()
      .then((user) => setUser(user))
      .catch((error) => {
        console.error('Error fetching user:', error);
        router.push('/login');
      });
  }, []);

  const handleCheckIn = async () => {
    try {
      await submitCheckIn({
        userId: user.uid,
        general,
        mood,
        notes,
        stress,
        sleep,
        activity,
        gratitude,
      });
      Alert.alert('Success', 'Check-in completed');
      router.push('/home');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <FlatList
        data={[{}]}
        renderItem={() => null}
        keyExtractor={(_, index) => index.toString()}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Daily Check-In</Text>

            <Text style={styles.label}>How are you feeling today?</Text>
            <TextInput
              style={styles.input}
              placeholder="Write a few words..."
              placeholderTextColor={theme === 'dark' ? '#888888' : '#999999'}
              value={general}
              onChangeText={setGeneral}
              multiline
            />

            <Text style={styles.label}>Stress Level</Text>
            <DropDownPicker
              open={openStress}
              value={stress}
              items={stressItems}
              setOpen={setOpenStress}
              setValue={setStress}
              setItems={setStressItems}
              onOpen={onStressOpen}
              style={styles.dropdown}
              listMode="SCROLLVIEW"
              zIndex={4000}
              zIndexInverse={1000}
            />

            <Text style={styles.label}>Mood</Text>
            <DropDownPicker
              open={openMood}
              value={mood}
              items={moodItems}
              setOpen={setOpenMood}
              setValue={setMood}
              setItems={setMoodItems}
              onOpen={onMoodOpen}
              style={styles.dropdown}
              listMode="SCROLLVIEW"
              zIndex={3000}
              zIndexInverse={2000}
            />

            <Text style={styles.label}>Sleep Quality</Text>
            <DropDownPicker
              open={openSleep}
              value={sleep}
              items={sleepItems}
              setOpen={setOpenSleep}
              setValue={setSleep}
              setItems={setSleepItems}
              onOpen={onSleepOpen}
              style={styles.dropdown}
              listMode="SCROLLVIEW"
              zIndex={2000}
              zIndexInverse={3000}
            />

            <Text style={styles.label}>Physical Activity</Text>
            <DropDownPicker
              open={openActivity}
              value={activity}
              items={activityItems}
              setOpen={setOpenActivity}
              setValue={setActivity}
              setItems={setActivityItems}
              onOpen={onActivityOpen}
              style={styles.dropdown}
              listMode="SCROLLVIEW"
              zIndex={1000}
              zIndexInverse={4000}
            />

            <Text style={styles.label}>What are you grateful for today?</Text>
            <TextInput
              style={styles.input}
              placeholder="Express your gratitude..."
              placeholderTextColor={theme === 'dark' ? '#888888' : '#999999'}
              value={gratitude}
              onChangeText={setGratitude}
              multiline
            />

            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={styles.input}
              placeholder="Any additional notes..."
              placeholderTextColor={theme === 'dark' ? '#888888' : '#999999'}
              value={notes}
              onChangeText={setNotes}
              multiline
            />

            <TouchableOpacity onPress={handleCheckIn} style={styles.button}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/home')}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Skip for Today</Text>
            </TouchableOpacity>
          </>
        }
        contentContainerStyle={styles.contentContainer}
      />
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: string) => {
  const isDark = theme === 'dark';
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#ffffff',
    },
    contentContainer: {
      padding: 16,
      paddingBottom: 30,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: isDark ? '#e0e0e0' : '#333',
    },
    label: {
      fontSize: 18,
      marginVertical: 10,
      color: isDark ? '#bbbbbb' : '#555',
    },
    input: {
      width: '100%',
      padding: 12,
      borderWidth: 1,
      borderColor: isDark ? '#444444' : '#ddd',
      borderRadius: 8,
      backgroundColor: isDark ? '#1e1e1e' : '#fff',
      fontSize: 16,
      color: isDark ? '#e0e0e0' : '#000',
      textAlignVertical: 'top',
      marginBottom: 15,
    },
    dropdown: {
      marginBottom: 15,
      borderColor: isDark ? '#444444' : '#ddd',
      borderRadius: 8,
    },
    button: {
      backgroundColor: isDark ? '#005bb5' : '#007BFF',
      paddingVertical: 15,
      borderRadius: 8,
      marginTop: 20,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
    secondaryButton: {
      paddingVertical: 15,
      borderRadius: 8,
      marginTop: 10,
      alignItems: 'center',
      borderColor: isDark ? '#888888' : '#6c757d',
      borderWidth: 1,
    },
    secondaryButtonText: {
      color: isDark ? '#bbbbbb' : '#6c757d',
      fontSize: 18,
      fontWeight: '600',
    },
  });
};
