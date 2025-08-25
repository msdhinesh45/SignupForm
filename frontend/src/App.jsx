import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Navbar from "./compo/Nav";

const App = () => {
  const PrivateRoute = ({ element }) => {
    const token = localStorage.getItem("token");
    return token ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<PrivateRoute element={<Home />} />} />
          <Route path="/users" element={<PrivateRoute element={<Users />} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;