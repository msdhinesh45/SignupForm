import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Signup = () => {
  const [form, setForm] = useState({ firstname:"", lastname:"", mobileNumber:"", email:"", password:"" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation
    if (!form.firstname || !form.lastname || !form.email || !form.password) {
      return Swal.fire("Validation ❌", "All fields are required", "warning");
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return Swal.fire("Invalid Email", "Enter valid email", "error");
    }
    if (form.password.length < 6) {
      return Swal.fire("Weak Password", "Password must be at least 6 chars", "error");
    }

    try {
      await axios.post("http://localhost:5000/api/users/register", form);
      Swal.fire("Success 🎉", "Signup successful! Please login.", "success");
      navigate("/login");
    } catch (err) {
      Swal.fire("Error ❌", err.response?.data?.message || "Signup failed", "error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card p-4">
        <h3 className="text-center mb-3">Signup</h3>
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" name="firstname" placeholder="First Name" onChange={handleChange} required />
          <input className="form-control mb-2" name="lastname" placeholder="Last Name" onChange={handleChange} required />
          <input className="form-control mb-2" name="mobileNumber" placeholder="Mobile Number" onChange={handleChange} required />
          <input className="form-control mb-2" type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input className="form-control mb-3" type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button className="btn w-100">Signup</button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <a href="/login" style={{color: '#fff', textDecoration: 'underline'}}>Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;