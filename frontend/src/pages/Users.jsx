import React, { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:5000/api/users/others", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setUsers(res.data))
    .catch((err) => console.error(err));
  }, [token]);

  return (
    <div className="users-container">
      <h2 className="users-title">Users</h2>
      
      {users.length > 0 ? (
        <div className="users-grid">
          {users.map((u) => (
            <div key={u._id} className="user-card">
              <h5>{u.firstname} {u.lastname}</h5>
              <div className="user-detail">
                <span className="user-icon">📱</span>
                <p className="user-info">{u.mobileNumber}</p>
              </div>
              <div className="user-detail">
                <span className="user-icon">📧</span>
                <p className="user-info">{u.email}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-users">
          <h4>No users found</h4>
          <p>There are no other users in the system yet.</p>
        </div>
      )}
    </div>
  );
};

export default Users;