# Civix – Digital Civic Engagement & Petition Platform # 

Civix is a digital platform designed to empower citizens to actively participate in local governance. It enables people to raise issues through petitions, participate in polls, and track responses from public officials, promoting transparency and accountability within communities.

The platform supports community-driven advocacy by allowing users to create location-based petitions and view public sentiment on local issues. Civix helps bridge the communication gap between citizens and government authorities by providing a structured and transparent engagement system.


# Key Features #

Petition Management
Users can create, edit, sign, and geo-tag petitions to raise awareness and gather support for local issues.

Public Polling System
Issue-based polls allow citizens to vote and view real-time sentiment trends on community concerns.

Governance Dashboard
Public officials can monitor petitions, analyze engagement levels, and respond to citizen feedback through a centralized dashboard.

Role-Based Access Control
Secure authentication with separate roles for Citizens and Public Officials, ensuring appropriate access and functionality.

# 🛠 Tech Stack #
 
Frontend: React.js, Vite

Backend: Node.js, Express.js

Database: MongoDB (Mongoose)

Authentication: JSON Web Tokens (JWT)

# ⚙️ Local Installation & Setup Guide #

Follow the steps below to run the project locally on your system.

🔧 Prerequisites

Ensure the following are installed on your machine:

Node.js

Git

MongoDB (Local installation or MongoDB Atlas)

📥 1. Clone the Repository
git clone https://github.com/springboardmentor9515a-collab/Digital-civic-nov-team01.git
cd Digital-civic-nov-team01

🖥️ 2. Backend Setup (Server)

Navigate to the server directory and install dependencies:

cd server
npm install

Environment Configuration

Create a .env file inside the server folder and add the following variables:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


Start the backend server:

npm start


The server will run on:
👉 http://localhost:5000

🌐 3. Frontend Setup (Client)

Open a new terminal window and navigate to the client folder:

cd client
npm install


Start the frontend application:

npm run dev


The application will run on:
👉 http://localhost:5173

✅ 4. Verify the Setup

Open your browser and visit the frontend URL.
If the login page loads successfully, the project setup is complete 🎉

📌 Notes

This project follows a full-stack MERN architecture

Designed for scalable civic engagement use cases

Suitable for academic projects, internships, and portfolio demonstrations