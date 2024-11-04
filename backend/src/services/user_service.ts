import { app, db, bucket } from '../firebase_options';
import admin from 'firebase-admin';
import { addDoc, collection, doc, getFirestore, setDoc, Timestamp } from 'firebase/firestore';
import { logToFirestore } from './logs_service';
import { User } from '../interfaces/user';

/**
 * Fetches a user from the 'users' collection.
 * @param uid - The UID of the user to fetch.
 * @returns Promise of the user document.
 */
export async function getAdditionalUserInfo(uid: string) {
    try {
        const usersRef = db.collection('users');
        const querySnapshot = await usersRef.where('uid', '==', uid).limit(1).get();

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data() as { name: string, profileImageUrl: string } | undefined;
            return {
                name: userData?.name,
                profileImageUrl: userData?.profileImageUrl,
            };
        } else {
            await logToFirestore({
                eventType: 'ERROR',
                message: 'User not found',
                data: { uid },
                timestamp: new Date().toISOString(),
            });

            throw new Error('User not found');
        }
    } catch (error: any) {
        console.error('Error fetching user info:', error);

        await logToFirestore({
            eventType: 'ERROR',
            message: 'Failed to fetch user info',
            data: { error: error.message, uid },
            timestamp: new Date().toISOString(),
        });

        throw new Error('Failed to fetch user info');
    }
}

export const saveUserToFirestore = async (userData: User) => {
    try {
        await addDoc(collection(getFirestore(app), 'users'), {
            ...userData,
        });
    } catch (error: any) {
        console.error('Error saving user to Firestore:', error);

        await logToFirestore({
            eventType: 'ERROR',
            message: 'Failed to save user to Firestore',
            data: { error: error.message, uid: userData.userId },
            timestamp: new Date().toISOString(),
        });

        throw new Error('Failed to save user to Firestore');
    }
};


export const updateUserDisplayNameService = async (userId: string, name: string) => {
    try {
        const userRef = db.collection('users');
        const querySnapshot = await userRef.where('uid', '==', userId).get();
        
        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            await userDoc.ref.update({ name });
          } else {
            console.error('User not found');
          }
    } catch (error: any) {
      console.error('Error updating display name in Firebase:', error);

      await logToFirestore({
        eventType: 'ERROR',
        message: 'Failed to update user display name',
        data: { error: error.message, uid: userId },
        timestamp: new Date().toISOString(),
    });
    
      throw new Error('Failed to update display name');
    }
  };

  export const uploadProfileImage = async (userId: string, file: any) => {
    try {
      const fileName = `profile_pictures/${userId}.jpg`;
      const storageFile = bucket.file(fileName);
  
      const blobStream = storageFile.createWriteStream({
        metadata: { contentType: file.mimetype },
      });
  
      await new Promise((resolve, reject) => {
        blobStream.on('error', reject);
        blobStream.on('finish', resolve);
        blobStream.end(file.buffer);
      });
  
      // Generate a signed URL for access
      const [url] = await storageFile.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
      });
  
      // Update Firestore with the URL
      const userRef = db.collection('users');
      const querySnapshot = await userRef.where('uid', '==', userId).get();
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await userDoc.ref.update({ profileImageUrl: url });
    } else {
        console.error('User not found');
        throw new Error('User not found');
    }
      return url;
    } catch (error) {
      console.error('Error in uploadProfileImage service:', error);
      throw new Error('Failed to upload image');
    }
  };