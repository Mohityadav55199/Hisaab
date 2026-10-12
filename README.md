# 💸 Hisaab

A beautiful and intuitive mobile application for splitting and managing shared expenses among friends and groups. Built with React Native (Expo) and Node.js, this app makes tracking shared expenses effortless.

---

## ✨ Features

- **👥 Friends Management** - Add and manage friends to split expenses with
- **📁 Group Support** - Create groups for trips, events, or shared households
- **💰 Expense Tracking** - Record expenses with multiple split options
- **📊 Smart Settlements** - Automatically calculates who owes whom
- **🗂️ Journey Archive** - Archive completed trips/events for future reference
- **🌓 Dark & Light Mode** - Automatic theme based on system preferences
- **☁️ Cloud Sync** - Data synced across devices via MongoDB

---

## 🛠️ Tech Stack

### Frontend (Mobile App)
- **React Native** with **Expo** (~54.0)
- **React Navigation** for seamless navigation
- **React Native Paper** for Material Design components
- **Axios** for API calls
- **AsyncStorage** for local data persistence

### Backend (API Server)
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **CORS** enabled for cross-origin requests
- RESTful API architecture

---

## 🚀 Getting Started

### Prerequisites

- Node.js (≥18.0.0)
- npm or yarn
- MongoDB Atlas account (or local MongoDB installation)
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device

### Installation & Running

1. **Clone the repository**
   ```bash
   git clone https://github.com/mohityadav55199/Hisaab.git
   cd Hisaab
   ```

2. **Install all dependencies**
   ```bash
   # Install root runner
   npm install

   # Install server & client dependencies
   cd server && npm install
   cd ../client && npm install
   cd ..
   ```

3. **Configure Environment Variables**
   
   Ensure `.env` exists in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/hisaab
   ```

4. **Start Both Server & Client Together**
   ```bash
   npm run dev
   ```
   *(or `npm start`)*
   - **Backend API**: Starts on `http://localhost:5000`
   - **Web App**: Opens on `http://localhost:8081`

5. **Demo in Mobile View (For Interviews)**
   - Open `http://localhost:8081` in Chrome or Edge.
   - Press **F12** and then **Ctrl + Shift + M** to toggle device frame (e.g. iPhone 14 Pro / Pixel 7).

---

## 📂 Project Structure

```
Hisaab/
├── client/                    # React Native mobile app
│   ├── src/
│   │   ├── context/          # React Context providers
│   │   ├── navigation/       # Navigation configuration
│   │   ├── screens/          # App screens
│   │   └── services/         # API service layer
│   ├── assets/               # Images and icons
│   ├── App.js                # App entry point
│   └── app.json              # Expo configuration
│
├── server/                    # Node.js backend
│   ├── models/               # Mongoose models
│   ├── db.js                 # Database connection
│   ├── logic.js              # Settlement calculation logic
│   └── index.js              # Express server & routes
│
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/user/init` | Initialize user |
| GET | `/api/people` | Get all people |
| POST | `/api/people` | Add a person |
| GET | `/api/friends` | Get friends list |
| POST | `/api/friends` | Add a friend |
| DELETE | `/api/friends/:id` | Delete a friend |
| GET | `/api/groups` | Get all groups |
| POST | `/api/groups` | Create a group |
| DELETE | `/api/groups/:id` | Delete a group |
| GET | `/api/expenses` | Get all expenses |
| POST | `/api/expenses` | Add an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |
| GET | `/api/settlement` | Calculate settlements |
| GET | `/api/journeys` | Get archived journeys |
| POST | `/api/journeys/archive` | Archive current journey |
| DELETE | `/api/journeys/:id` | Delete a journey |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Mohit Yadav**

- GitHub: [@mohityadav55199](https://github.com/mohityadav55199)

---

## 🙏 Acknowledgments

- React Native community
- Expo team for the amazing development experience
- MongoDB Atlas for free tier cloud database

---

<p align="center">
  Made with ❤️ for easier expense splitting
</p>