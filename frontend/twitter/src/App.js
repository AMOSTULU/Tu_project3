// src/App.js
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/LoginPage';
import RegisterForm from './components/RegisterForm';
import ViewTweets from './pages/ViewTweets'; 
import NewEntryPage from './pages/NewEntryPage';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import UserPage from './pages/UserPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const savedUsername = localStorage.getItem('username');
    if (savedIsLoggedIn && savedUsername) {
        setIsLoggedIn(true);
        setUsername(savedUsername);
    }
}, []);

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
    localStorage.setItem('username', username); 
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
  };

  const updateLoginStatus = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
  };

  return (
    <Router>
      <div className="App">
        <Navbar isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
        <Routes>
        <Route path="/" element={<ViewTweets />} /> {}
          <Route path="/login" element={isLoggedIn ? <Navigate replace to="/" /> : <Login onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterForm onLoginStatusChange={updateLoginStatus} />} />
          <Route path="/user/:username" element={<UserPage currentUser={username} />} />
          {isLoggedIn && <Route path="/new-tweet" element={<NewEntryPage />} />}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
