Overview
This project is a full-stack application with a React Native frontend and an Express/Node.js backend using Firebase for authentication and Firestore for data storage. It includes a daily check-in feature and user authentication.

Prerequisites
Node.js (v14+)
npm (v6+)
Firebase project set up with Firestore and Authentication

Getting Started

Backend Setup

Navigate to the Backend Directory:

cd backend

Install Dependencies:

npm install

Set Up Environment Variables:

Create a serviceAccountKey.json in the backend src directory. This is the service Account Key that you download from frirebase.

Create a .env file with your firebase api keys from your firebase options file, as well as a GOOGLE_APPLICATION_CREDENTIALS variable to host the path of your serviceAccountKey.json

Add a NODE_ENV environment variable = development

Add your Firebase credentials and other environment variables as needed.

Start the Backend Server:

npm start. Alternatively using ts-node run npx ts-node src/index.ts



Frontend Setup

Navigate to the Frontend Directory:

cd mentalhealthappfrontend

Install Dependencies:

npm install

add a .env.development file with your EXPO_PUBLIC_API_URL

Ensure that this route is in the backend index.ts as an allowed CORS route.

Start the React Native App:

npm run dev for development

npm run start:prod-api to run the frontend with the backend on the server rather than local.
