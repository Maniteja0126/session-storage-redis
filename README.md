## Session Storage System with Redis, JWT, and Bcrypt
This project is a basic session management system built with Node.js, Express, Redis, JWT, and bcrypt. It includes user signup, login, session-based authentication, and logout functionality, where session data is securely managed with Redis.

## Features
- User Signup: Registers a new user with a hashed password.
- User Login: Authenticates the user, generates a JWT, and stores a session token in Redis.
- Session Management: Validates the user’s session by checking both JWT and Redis.
- Logout: Logs the user out by removing the session token from Redis.

## Tech Stack
- Node.js: Backend JavaScript runtime.
- Express: Node.js framework for building RESTful APIs.
- Redis: In-memory data store for session storage.
- JWT (JSON Web Tokens): Token-based authentication.
- bcrypt: Password hashing for secure credential storage.
