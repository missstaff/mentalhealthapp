// RemoveCrisisContactModal.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { deleteUserContact, getUserContacts } from '../api/userContacts';
import { userContactModel } from '@/models/userContactModel';

interface Props {
  visible: boolean;
  onClose: () => void;
  userId: string;
  onContactRemoved: () => void;
}

const RemoveCrisisContactModal: React.FC<Props> = ({
  visible,
  onClose,
  userId,
  onContactRemoved,
}) => {
  const [contacts, setContacts] = useState<userContactModel[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user contacts when modal opens
  useEffect(() => {
    if (visible) {
      fetchContacts();
    }
  }, [visible]);

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedContacts = await getUserContacts(userId);
      setContacts(fetchedContacts);
    } catch (err: any) {
      console.error('Error fetching contacts:', err);
      setError('Failed to load contacts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveContact = (contactId: string, contactName: string) => {
    Alert.alert(
      'Confirm Removal',
      `Are you sure you want to remove ${contactName} from your crisis contacts?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeContact(contactId),
        },
      ]
    );
  };

  const removeContact = async (contactId: string) => {
    try {
      await deleteUserContact(userId, contactId);
      Alert.alert('Success', 'Contact removed successfully.');
      fetchContacts(); 
      onContactRemoved(); 
    } catch (err: any) {
      console.error('Error removing contact:', err);
      Alert.alert('Error', 'Failed to remove contact. Please try again.');
    }
  };

  const renderContactItem = useCallback(
    ({ item }: { item: userContactModel }) => (
      <View style={styles.contactItem}>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.contactName}</Text>
          <Text style={styles.contactNumber}>{item.phoneNumber}</Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveContact(item.contactId, item.contactName)}
          accessibilityLabel={`Remove ${item.contactName}`}
        >
          <Icon name="delete" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    ),
    []
  );

  return (
    <Modal visible={visible} onRequestClose={onClose} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={styles.touchableArea} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContainer}>
          <Text style={styles.title}>Remove Crisis Contact</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#6200EE" style={styles.loader} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : contacts && contacts.length > 0 ? (
            <FlatList
              data={contacts}
              keyExtractor={(item) => item.contactId}
              renderItem={renderContactItem}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <Text style={styles.noDataText}>No crisis contacts to remove.</Text>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RemoveCrisisContactModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1A237E',
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A237E',
  },
  contactNumber: {
    fontSize: 14,
    color: '#3949AB',
  },
  removeButton: {
    backgroundColor: '#D32F2F',
    padding: 8,
    borderRadius: 6,
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: '#3949AB',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
