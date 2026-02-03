import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Rankings from './pages/Rankings';
import AdminMembers from './pages/AdminMembers';
import Header from './components/Header';
import Footer from './components/Footer';
import { userApi } from './api';

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Check cookies for user session
    const cookies = document.cookie.split('; ');
    const userIdCookie = cookies.find(row => row.startsWith('user_id='));
    const userNameCookie = cookies.find(row => row.startsWith('user_name='));

    if (userIdCookie && userNameCookie) {
      setUser({
        id: userIdCookie.split('=')[1],
        name: decodeURIComponent(userNameCookie.split('=')[1])
      });
    }

    // Load users for rankings
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await userApi.getAll();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = (userData) => {
    document.cookie = `user_id=${userData.id}; path=/; max-age=86400`;
    document.cookie = `user_name=${encodeURIComponent(userData.name)}; path=/; max-age=86400`;
    setUser(userData);
  };

  const handleLogout = () => {
    document.cookie = 'user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'user_name=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {user && <Header user={user} onLogout={handleLogout} />}
        <main className="container mx-auto px-4 py-8 flex-1">
          <Routes>
            <Route
              path="/"
              element={user ? <Navigate to="/dashboard" /> : <Landing onLogin={handleLogin} />}
            />
            <Route
              path="/dashboard"
              element={user ? <Dashboard user={user} /> : <Navigate to="/" />}
            />
            <Route
              path="/profile/:id"
              element={user ? <Profile currentUser={user} /> : <Navigate to="/" />}
            />
            <Route
              path="/rankings"
              element={user ? <Rankings users={users} /> : <Navigate to="/" />}
            />
            <Route
              path="/admin/members"
              element={user ? <AdminMembers /> : <Navigate to="/" />}
            />
          </Routes>
        </main>
        {user && <Footer />}
      </div>
    </Router>
  );
}

export default App;
