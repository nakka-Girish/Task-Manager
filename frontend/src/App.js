import React, { useState } from "react";
import AuthForm from "./components/AuthForm";
import UserTodoApp from "./components/UserTodoApp";
import AdminTodoApp from "./components/AdminTodoApp";

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      {!user ? (
        <AuthForm setUser={setUser} />
      ) : user.role === "admin" ? (
        <AdminTodoApp username={user.username} />
      ) : (
        <UserTodoApp username={user.username} />
      )}
    </div>
  );
}
