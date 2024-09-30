import express from 'express';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase_options';
import { saveUserToFirestore } from '../services/user_service';
import { addDoc, collection } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

const router = express.Router();
const auth = getAuth(app);

// Register a new user
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      res.status(400).send({ error: 'Email is required' });
      return;
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email ?? '', password);
    
    if (!userCredential.user.email) {
      throw new Error('Email is required');
    }
    const userData = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      // add any other user data you want to store
    };

    await saveUserToFirestore(userData);

    res.status(201).send({ uid: userCredential.user.uid });
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
});

// Login user and return custom token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const userRecord = await signInWithEmailAndPassword(auth, email, password);
      res.status(200).send({ uid: userRecord.user.uid });
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  });

router.get('/user', async (req, res) => {
    const user = auth.currentUser;
    if (user) {
        res.status(200).send({ uid: user.uid });
    } else {
        res.status(400).send({ error: 'User not logged in' });
    }
});

router.post('/signout', async (req, res) => {
    try {
        await auth.signOut();
        res.status(200).send({ message: 'User signed out' });
    } catch (error: any) {
        res.status(400).send({ error: error.message });
    }
});

export default router;
