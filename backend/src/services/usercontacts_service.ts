import { app, db } from '../firebase_options';
import { logToFirestore } from './logs_service';
import { v4 as uuidv4 } from 'uuid';

export const retrieveUserContacts = async (userId: string) => {
    try {
      const phoneNumberRef = db.collection('usercontacts').where('userId', '==', userId);
      const snapshot = await phoneNumberRef.get();
      const userPhoneNumbers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return userPhoneNumbers;
    } catch (error: any) {
      console.error('Error retrieving user contacts for user', userId, ':', error);

      await logToFirestore({
        eventType: 'ERROR',
        message: 'Failed to retrieve user contacts',
        data: { error: error.message, userId },
        timestamp: new Date().toISOString(),
      });
      
      throw new Error('Failed to retrieve user contacts');
    }
  }

export const saveUserContactToDatabase = async (userId: string, contactName: string,phoneNumber: string, phoneNumberType: string) => {
    try {
      const userContactRef = db.collection('usercontacts').doc();
      const contactId = uuidv4();
      await userContactRef.set({ userId, contactName, phoneNumber, phoneNumberType, contactId });
      return userContactRef.id;
    } catch (error: any) {
      console.error('Error saving user contact:', error);

      await logToFirestore({
        eventType: 'ERROR',
        message: 'Failed to save user contact to database',
        data: { error: error.message, userId },
        timestamp: new Date().toISOString(),
      });

      throw new Error('Failed to save user contact');
    }
  }

  export const removeUserContactFromDatabase = async (contactId: string) => {
    try {
      const contactRef = db.collection('usercontacts').where('contactId', '==', contactId);
      const querySnapshot = await contactRef.get();
      if (querySnapshot.docs.length > 0) {
        await querySnapshot.docs[0].ref.delete();
      }
    } catch (error: any) {
      console.error('Error removing user contact:', error);
  
      await logToFirestore({
        eventType: 'ERROR',
        message: 'Failed to remove user contact from database',
        data: { error: error.message, contactId },
        timestamp: new Date().toISOString(),
      });
  
      throw new Error('Failed to remove user contact');
    }
  }

