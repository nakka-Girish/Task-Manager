import React, { useState } from "react";
import UserTodoApp from "./UserTodoApp";
import AdminTodoApp from "./AdminTodoApp";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null); // store logged-in user info

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin
      ? "http://localhost:8081/auth/login"
      : "http://localhost:8081/auth/signup";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.role) {
        // Store user info with username and role
        setUser({ username, role: data.role.toUpperCase() }); // Make role uppercase for consistency
      }

      setMessage(data.message + (data.role ? ` (Role: ${data.role})` : ""));
    } catch (error) {
      setMessage("Error connecting to server");
      console.error(error);
    }
  };

  // Render the correct Todo component based on role
  if (user) {
    return user.role === "ADMIN" ? (
      <AdminTodoApp username={user.username} /> // Pass username to AdminTodoApp as well
    ) : (
      <UserTodoApp username={user.username} />
    );
  }

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>{isLogin ? "Sign In" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: "20px" }}>
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      <p style={{ marginTop: "10px" }}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage("");
          }}
        >
          {isLogin ? "Sign Up" : "Sign In"}
        </button>
      </p>

      {message && <p style={{ marginTop: "10px", color: "red" }}>{message}</p>}
    </div>
  );
};

export default AuthForm;
