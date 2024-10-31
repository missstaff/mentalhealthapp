import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth_routes';
import checkinRoutes from './routes/checkin_routes';
import insightRoutes from './routes/insight_routes';
import crisisRoutes from './routes/crisis_routes';
import userRoutes from './routes/user_routes';
import recommendedResourceRoutes from './routes/recommendedresource_routes';
import admin from 'firebase-admin';
import userContactRoutes from './routes/userContacts_routes';
import logRoutes from './routes/log_routes';
import { requestLogger } from './utilities/logUtils';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

const app = express();
const firebase = require('./firebase_options');
const port = process.env.PORT || 3000;

const logRateLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute window
  max: 100,             // Max 100 requests per minute
  message: 'Too many log requests. Please try again later.',
});

// List of allowed origins
const allowedOrigins = [
  'http://localhost:8081',
  'http://10.0.2.2:3000', 
  'http://192.168.1.79:3000',
];

// Use Parameters utility to infer CORS options type
const corsOptions: Parameters<typeof cors>[0] = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return callback(null, true); // Allow requests with no origin

    if (allowedOrigins.includes(origin)) {
      callback(null, true); // Allow request
    } else {
      callback(new Error(`CORS policy does not allow access from origin: ${origin}`), false); // Block request
    }
  },
  credentials: true, // Allow cookies and credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204, // For legacy browsers like IE11
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests (OPTIONS method)
app.options('*', cors(corsOptions));

// Request logger middleware
app.use(requestLogger);

// Body parser middleware
app.use(bodyParser.json());

// Define routes
app.use('/auth', authRoutes);
app.use('/checkin', checkinRoutes);
app.use('/insight', insightRoutes);
app.use('/crisis', crisisRoutes);
app.use('/contacts', userContactRoutes);
app.use('/log', logRateLimiter, logRoutes);
app.use('/user', userRoutes);
app.use('/resources', recommendedResourceRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
