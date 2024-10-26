import express from 'express';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { Request, Response } from 'express';
import { app } from '../firebase_options';
import { getAdditionalUserInfo, saveUserToFirestore } from '../services/user_service';
import { logToFirestore } from '../services/logs_service';  // Logging service

const auth = getAuth(app);

// Register User
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!email) {
      await logToFirestore({
        eventType: 'ERROR',
        message: 'Email is required',
        data: {},
        timestamp: new Date().toISOString(),
      });
      return res.status(400).send({ error: 'Email is required' });
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email ?? '', password);

    if (!userCredential.user.email) {
      throw new Error('Email is required');
    }

    const userData = {
      uid: userCredential.user.uid,
      name: name,
      email: userCredential.user.email,
    };

    await saveUserToFirestore(userData);
    
    res.status(201).send({ uid: userCredential.user.uid });
  } catch (error: any) {
    console.error('Registration error:', error);

    await logToFirestore({
      eventType: 'ERROR',
      message: 'Registration failed',
      data: { error: error.message },
      timestamp: new Date().toISOString(),
    });

    res.status(400).send({ error: error.message });
  }
};

// Login User
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();

    res.status(200).send({ uid: userCredential.user.uid, token });
  } catch (error: any) {
    console.error('Login error:', error);

    await logToFirestore({
      eventType: 'ERROR',
      message: 'Login failed',
      data: { error: error.message },
      timestamp: new Date().toISOString(),
    });

    res.status(400).send({ error: error.message });
  }
};

// Sign Out User
export const signout = async (req: Request, res: Response) => {
  try {
    await auth.signOut();

    await logToFirestore({
      eventType: 'SUCCESS',
      message: 'User signed out successfully',
      data: {},
      timestamp: new Date().toISOString(),
    });

    res.status(200).send({ message: 'User signed out' });
  } catch (error: any) {
    console.error('Signout error:', error);

    await logToFirestore({
      eventType: 'ERROR',
      message: 'Signout failed',
      data: { error: error.message },
      timestamp: new Date().toISOString(),
    });

    res.status(400).send({ error: error.message });
  }
};

// Get User Info
export const getUserInfo = async (req: Request, res: Response) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userInfo = await getAdditionalUserInfo(user.uid);
  
        await new Promise((resolve) => setTimeout(resolve, 0));

        res.status(200).send({ uid: user.uid, ...userInfo });
      } catch (error: any) {
        console.error('Error fetching user info:', error);

        await logToFirestore({
          eventType: 'ERROR',
          message: 'Failed to fetch user info at getUserInfo',
          data: { error: error.message},
          timestamp: new Date().toISOString(),
        });

        res.status(500).send({ error: 'Error fetching additional user info' });
      }
    } else {
      res.status(400).send({ error: 'User not logged in' });
    }
  }
