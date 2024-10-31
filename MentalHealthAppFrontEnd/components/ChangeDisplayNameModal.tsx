// ChangeDisplayNameModal.js
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { updateDisplayName } from '@/api/user';

interface Props {
    visible: boolean;
    onClose: () => void;
    currentDisplayName: string;
    userId: string;
  }

const ChangeDisplayNameModal: React.FC<Props> = ({ visible, onClose, currentDisplayName, userId }) => {
  const [newDisplayName, setNewDisplayName] = useState(currentDisplayName || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!newDisplayName.trim()) {
      Alert.alert('Validation Error', 'Display name cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      await updateDisplayName(newDisplayName, userId);
      Alert.alert('Success', 'Display name updated successfully! Please sign out and sign back in to see the changes.');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update display name.');
      console.error('Error updating display name:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Change Display Name</Text>

          <TextInput
            style={styles.input}
            value={newDisplayName}
            onChangeText={setNewDisplayName}
            placeholder="Enter new display name"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Save</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginRight: 5,
    backgroundColor: '#1E90FF',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    marginLeft: 5,
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default ChangeDisplayNameModal;
