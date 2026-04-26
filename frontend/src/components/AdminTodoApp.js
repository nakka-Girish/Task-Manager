import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminTodoApp({ username }) {
  const [todos, setTodos] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [priority, setPriority] = useState(1);
  const [dueDate, setDueDate] = useState("");
  const [assignedUser, setAssignedUser] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (assignedUser) fetchTodos(assignedUser);
  }, [assignedUser]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/todos/users");
      setUsers(res.data);
      if (res.data.length > 0) setAssignedUser(res.data[0].username);
    } catch (err) {
      console.error("Failed to fetch users", err.response || err);
      alert("Failed to fetch users");
    }
  };

  const fetchTodos = async (username) => {
    try {
      const res = await axios.get(
        `http://localhost:8081/api/todos?username=${username}`
      );
      setTodos(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch todos");
    }
  };

  const addTodo = async () => {
    if (!newTodo || !dueDate || !assignedUser)
      return alert("Fill all fields");
    try {
      const res = await axios.post(
        `http://localhost:8081/api/todos/add?username=${assignedUser}`,
        { title: newTodo, priority, dueDate }
      );
      setTodos([...todos, res.data]);
      setNewTodo("");
      setPriority(1);
      setDueDate("");
    } catch (err) {
      console.error(err);
      alert("Failed to add todo");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/todos/${id}`);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete todo");
    }
  };

  // 🔹 Check overdue
  const isOverdue = (todo) => {
    if (!todo.dueDate || todo.completed) return false;
    return new Date(todo.dueDate) < new Date();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Admin Dashboard</h2>

      {/* User selection */}
      <div style={{ marginBottom: "20px" }}>
        <select
          value={assignedUser}
          onChange={(e) => setAssignedUser(e.target.value)}
        >
          {users.map((u) => (
            <option key={u.id} value={u.username}>
              {u.username}
            </option>
          ))}
        </select>
      </div>

      {/* Add new todo */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="New Task Title"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
        >
          <option value={1}>⭐</option>
          <option value={2}>⭐⭐</option>
          <option value={3}>⭐⭐⭐</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {/* Todos list */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => {
          const overdue = isOverdue(todo);

          return (
            <li
              key={todo.id}
              style={{
                margin: "10px 0",
                padding: "10px",
                background: todo.completed
                  ? "#d4edda"
                  : overdue
                  ? "#f8d7da"
                  : "#fff3cd",
                borderRadius: "5px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>
                {todo.title} ({"⭐".repeat(todo.priority)})
                <br />DueDate: {todo.dueDate}
                <br />Status:{" "}
                {todo.completed
                  ? "✅ Completed"
                  : overdue
                  ? "⛔ Overdue"
                  : "⏳ Pending"}
              </span>
              <div>
                {overdue && (
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    🚩 Overdue
                  </span>
                )}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  style={{
                    marginLeft: "10px",
                    color: "white",
                    background: "red",
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
