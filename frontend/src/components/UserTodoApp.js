import React, { useState, useEffect } from "react";
import axios from "axios";

export default function UserTodoApp({ username }) {
  const [todos, setTodos] = useState([]);
  console.log("Fetching todos for username:", username);

  useEffect(() => {
    console.log("Fetching todos for:", username);
    fetchTodos();
  }, [username]);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`http://localhost:8081/api/todos?username=${username}`);
      console.log("Fetched todos:", res.data);
      setTodos(res.data);
    } catch (err) {
      console.error("Fetch Todos Error:", err);
      const msg = err.response?.data?.message || err.message || JSON.stringify(err.response?.data);
      alert("Failed to fetch todos: " + msg);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const res = await axios.put(`http://localhost:8081/api/todos/${id}/toggle`);
      setTodos(todos.map((t) => (t.id === id ? res.data : t)));
    } catch (err) {
      console.error(err);
      alert("Failed to update todo");
    }
  };

  const sortTodos = () => {
    const sorted = [...todos].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    setTodos(sorted);
  };

  // 🔹 Helper to check overdue
  const isOverdue = (todo) => {
    if (!todo.dueDate || todo.completed) return false;
    return new Date(todo.dueDate) < new Date(); // past date
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>{username} Todos</h2>

      <button onClick={sortTodos}>Sort by Due Date</button>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => {
          const overdue = isOverdue(todo);

          return (
            <li
              key={todo.id}
              style={{
                margin: "10px 0",
                padding: "10px",
                background: todo.completed ? "#d4edda" : overdue ? "#f8d7da" : "#fff3cd",
                borderRadius: "5px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>
                {todo.title} ({"⭐".repeat(todo.priority)})
                <br />DueDate : {todo.dueDate}
                <br />Status:{" "}
                {todo.completed
                  ? "✅ Completed"
                  : overdue
                  ? "⛔ Overdue"
                  : "⏳ Pending"}
              </span>

              <div>
                {overdue ? (
                  <span style={{ color: "red", fontWeight: "bold" }}>🚩 Overdue</span>
                ) : (
                  <button onClick={() => toggleTodo(todo.id)}>
                    {todo.completed ? "Undo" : "Complete"}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
