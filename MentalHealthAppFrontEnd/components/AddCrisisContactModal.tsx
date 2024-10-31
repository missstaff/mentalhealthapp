import React, { useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { saveUserContact } from '../api/userContacts';

interface Props {
  visible: boolean;
  onClose: () => void;
  userId: string;
}

const AddCrisisContactModal: React.FC<Props> = ({ visible, onClose, userId }) => {
  const [contactName, setContactName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberType, setPhoneNumberType] = useState('home');
  const [error, setError] = useState<string | null>(null);

  // Dropdown state
  const [openPicker, setOpenPicker] = useState(false);
  const [items, setItems] = useState([
    { label: 'Home', value: 'home' },
    { label: 'Mobile', value: 'mobile' },
    { label: 'Work', value: 'work' },
    { label: 'Other', value: 'other' },
  ]);

  // Close keyboard when dropdown opens
  const onPickerOpen = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const handleSubmit = async () => {
    if (!contactName) {
      setError('Please enter a contact name.');
      return;
    }
    if (!phoneNumber) {
      setError('Please enter a phone number.');
      return;
    }

    try {
      await saveUserContact(userId, contactName, phoneNumber, phoneNumberType);
      
      onClose();
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.touchableArea} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContainer}>
          <Text style={styles.title}>Add Crisis Contact</Text>

          <TextInput
            value={contactName}
            onChangeText={setContactName}
            placeholder="Contact Name"
            style={styles.input}
          />

          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            style={styles.input}
          />

          <View style={styles.dropdownContainer}>
            <DropDownPicker
              open={openPicker}
              value={phoneNumberType}
              items={items}
              setOpen={setOpenPicker}
              setValue={setPhoneNumberType}
              setItems={setItems}
              onOpen={onPickerOpen}
              style={styles.dropdown}
              placeholder="Select Phone Number Type"
              zIndex={5000}
              zIndexInverse={6000}
            />
          </View>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
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
    zIndex: 10000,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  dropdownContainer: {
    zIndex: 5000,
    marginBottom: 15,
  },
  dropdown: {
    borderColor: '#ddd',
    borderRadius: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButtonText: {
    color: '#fff',
  },
});

export default AddCrisisContactModal;
