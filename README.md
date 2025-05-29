# WTWR (What to Wear?): Back End

The back-end project powers the WTWR application server. It handles API routes, user authentication, and connects to a MongoDB database. You’ll gain experience working with databases, setting up security, deploying apps to a remote machine, and using Docker.

---

## 🔧 Running the Project

```bash
npm install
```

To start the server:

```bash
npm run start
```

To start the server with hot reload (dev mode):

```bash
npm run dev
```

---

## 💪 Testing Instructions

Before committing, edit the `sprint.txt` file in the root folder.  
It should contain the sprint number you're currently on. Example:

```
12
```

---

## 📦 MongoDB Setup (Using Docker)

Instead of installing MongoDB directly, this project uses **Docker**:

```bash
sudo docker run -d \
  --name mongodb \
  -p 27017:27017 \
  mongo:6.0
```

This launches MongoDB locally on port `27017` without username/password authentication.

---

### Accessing MongoDB Shell

To enter the MongoDB shell (like Compass CLI):

```bash
sudo docker exec -it mongodb mongosh


## ⚙️ Environment Variables

Create a `.env` file in the root directory with:

```env
MONGO_URI=mongodb://127.0.0.1:27017/wtwr_db
```

This enables the server to connect to the MongoDB instance (Docker or local).

---

## 🧐 Project Description

This is the back end of the WTWR site created in the previous project. It:

- Sets up an Express server to run the API
- Connects to a MongoDB database to store user info and clothing items
- Implements authentication and authorization
- Uses a linter to flag code issues and enforce styling conventions
- Includes Postman tests and GitHub test validation

MongoDB’s `_id` field requires disabling a linter rule (`no-underscore-dangle`) to prevent false positives.

---

## 🔐 Authorization & Authentication (Update)

This version includes:

- User registration and login using JWT tokens
- Protected routes for accessing personal data and managing clothing items
- Secure password hashing with bcrypt

---

## 🌍 Hosting Info

The backend server is hosted on a **Google Cloud Virtual Machine**.

- MongoDB runs in a Docker container
- The server listens on **port 3001**
- SSH and firewall are configured to allow external access for testing

---

## ✅ Summary

- Node.js v20
- Express server
- MongoDB via Docker
- Deployed on Google Cloud VM
- JWT-based auth
- Secure and linted backend API
