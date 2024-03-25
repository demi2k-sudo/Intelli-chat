# Chat Application Documentation

## Overview
This project is a chat application consisting of both frontend and backend components. The application allows users to register, login, send messages to other users, and receive messages in real-time. The backend is built using Node.js with Express for handling HTTP requests and WebSocket for real-time communication. The frontend is developed using React.js.

## Repository Structure
The repository is structured as follows:
- **Backend:** Contains the backend code including Express server setup, WebSocket implementation, and database models.
- **Frontend:** Contains the frontend React components responsible for user interface and interaction.
- **README.md:** Contains information about the project, setup instructions, and usage guidelines.

## Backend
The backend is responsible for handling user authentication, message storage, and WebSocket communication for real-time messaging.

### Dependencies
- **Express:** For building the RESTful API and serving static files.
- **WebSocket:** For implementing real-time bidirectional communication between the client and the server.
- **Mongoose:** MongoDB object modeling tool designed to work in an asynchronous environment.
- **jsonwebtoken:** For generating and verifying JSON Web Tokens (JWT) for user authentication.
- **bcryptjs:** For hashing passwords securely.
- **cors:** Middleware for enabling Cross-Origin Resource Sharing (CORS) in the Express app.
- **body-parser:** Middleware for parsing incoming request bodies in a middleware before handling.
- **cookie-parser:** For parsing cookies attached to the client's request.

### Backend Files
- **index.js:** Main entry point of the backend application. It sets up the Express server, connects to the MongoDB database, defines API endpoints for user authentication, message handling, and WebSocket communication.
- **models/User.js:** Defines the Mongoose schema for user data.
- **models/Message.js:** Defines the Mongoose schema for storing chat messages.

## Frontend
The frontend is developed using React.js and is responsible for rendering the user interface, managing user interactions, and communicating with the backend API.

### Dependencies
- **React:** JavaScript library for building user interfaces.
- **axios:** Promise-based HTTP client for making requests to the backend API.
- **lodash:** Utility library for simplifying common programming tasks.
- **WebSocket:** For establishing a WebSocket connection with the backend server.

### Frontend Files
- **chat.js:** Main component responsible for rendering the chat interface, managing WebSocket connections, handling message sending, and displaying received messages.
- **Avatar.js:** Component for displaying user avatars.
- **Logo.js:** Component for displaying the application logo.
- **Contact.js:** Component for displaying contacts in the chat sidebar.

## Usage
To run the application locally, follow these steps:
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies for both backend and frontend using `npm install`.
4. Start the backend server by running `npm start` in the backend directory.
5. Start the frontend development server by running `npm start` in the frontend directory.
6. Access the application in your web browser at `http://localhost:3000`.

## Features
- User registration and login.
- Real-time messaging using WebSocket.
- Displaying online/offline users.
- Sending messages to individual users.
- Displaying received messages in real-time.
- AI integration with a custom chatbot
- AI suggestions for replying.




## Screenshots
![Screenshot (892)](https://github.com/demi2k-sudo/Intelli-chat/assets/85375873/1f428b34-bd13-4b53-99b5-bf829679fecc)
![Screenshot (881)](https://github.com/demi2k-sudo/Intelli-chat/assets/85375873/8c6d99bc-8846-4b14-98fe-893445e4a17a)



