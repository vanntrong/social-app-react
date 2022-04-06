import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import ProfilePage from "./pages/profile/ProfilePage";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { MessengerPage } from "./pages/messenger/MessengerPage";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <Routes>
      <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
      <Route path="/profile/:username" element={<ProfilePage />} />
      <Route path="/messenger" element={!user ? <Navigate to="/" /> : <MessengerPage />} />
    </Routes>
  );
}

export default App;
