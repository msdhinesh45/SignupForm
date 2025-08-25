import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const [form, setForm] = useState({ email: "", mobileNumber: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.email || !form.password) {
      return Swal.fire(
        "Validation ❌",
        "Email and Password required",
        "warning"
      );
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return Swal.fire("Invalid Email", "Please enter a valid email", "error");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/users/login", form);

      // Save token + user info in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));

      // Success alert → then redirect + refresh
      Swal.fire("Welcome 🚀", "Login successful!", "success").then(() => {
        navigate("/home");
        window.location.reload(); // force refresh so navbar/user state updates
      });
    } catch (err) {
      Swal.fire(
        "Login Failed ❌",
        err.response?.data?.message || "Invalid credentials",
        "error"
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card p-4">
        <h3 className="text-center mb-3">Login</h3>
        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            className="form-control mb-3"
            name="mobileNumber"
            placeholder="Mobile Number"
            onChange={handleChange}
          />
          <input
            className="form-control mb-3"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button className="btn w-100 btn-primary" type="submit">
            Login
          </button>
        </form>
        <p className="text-center mt-3">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            style={{ color: "#fff", textDecoration: "underline" }}
          >
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
