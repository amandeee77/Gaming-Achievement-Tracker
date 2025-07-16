🎮 Gaming Achievement Tracker


Overview

The Gaming Achievement Tracker is a responsive full-stack web application that allows users to submit, visualize, and manage progress toward their personal gaming goals. Users can record achievements, fetch game metadata using the RAWG API, and experience a personalized dashboard whether logged in or exploring as a guest.
Built with Node.js, Express.js, and integrated with MongoDB and the RAWG API, this app showcases full-stack functionality, session-based personalization, and dynamic DOM rendering.

✨ Features
- 📘 Submit gaming achievements with custom titles and progress values
- 🎨 Visualize achievement progress with dynamic UI cards and gold progress bars
- 🧠 Fetch game cover images and genres using RAWG.io game database
- 👤 User login/signup with session-based welcome banner
- 🔁 Achievements persist across refreshes using MongoDB
- 📱 Responsive design optimized for mobile and desktop
- 🔑 Guest access with optional registration flow

🛠 Technologies Used
| Layer | Stack | 
| Frontend | HTML, CSS, JavaScript (Vanilla) | 
| Backend | Node.js, Express.js | 
| API | RAWG.io | 
| Database | MongoDB + Mongoose | 
| Styling | Custom CSS + media queries | 



🚀 How to Run the Project Locally


###1. 📦 Install Node.js
If you haven’t already, download and install Node.js for your system.


###2. 🧱 Clone This Repository
git clone https://github.com/amandeee77/gaming-achievement-tracker.git
cd gaming-achievement-tracker


###3. 🔑 Get a RAWG.io API Key
Visit RAWG.io and:
- Sign up for a free developer account
- Go to Dashboard > API Keys
- Copy your key and paste it into your .env file:
RAWG_API_KEY=your_rawg_key_here


###4. 🗄️ MongoDB Database Connection
- Create a free account at MongoDB Atlas
- Build a new cluster and get your connection string
- Whitelist your IP address and create a database (e.g. gaming-tracker)
- Add this to your .env file:
MONGO_URI=your_mongo_connection_string_here


###5. 📥 Install Dependencies
npm install


###6. ▶️ Run the Server
node server.js


Visit your app locally at:
http://localhost:3000



📌 Future Improvements
- 📊 Integrate charts (Chart.js or D3.js) for progress visualization
- 🥇 Implement leaderboard or multiplayer comparison
- 🧑‍🎨 Allow profile customization with avatars and bios
- 🎯 Build achievement filters and genre sorting

💛 Credits
Special thanks to RAWG.io for their open game database API.



