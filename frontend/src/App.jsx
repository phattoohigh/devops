import { useState, useEffect } from 'react';

const API_URL =
  process.env.REACT_APP_API_URL || `http://${window.location.hostname}:8080`;

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/todos`);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      await fetch(`${API_URL}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo })
      });
      setNewTodo('');
      fetchTodos();
    } catch (err) {
      alert('Failed to add todo');
    }
  };

  const toggleTodo = async (todo) => {
    try {
      await fetch(`${API_URL}/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: todo.title,
          completed: !todo.completed,
        }),
      });
      fetchTodos();
    } catch (err) {
      alert('Failed to update todo');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/api/todos/${id}`, {
        method: 'DELETE',
      });
      fetchTodos();
    } catch (err) {
      alert('Failed to delete todo');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>🚀 DevOps Todo App</h1>
      <p>Demo: Watch UI update LIVE after CI/CD! ✨</p>

      <div style={{ marginBottom: '20px' }}>
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new todo..."
          style={{ padding: '10px', width: '70%', marginRight: '10px' }}
        />
        <button onClick={addTodo} style={{ padding: '10px 20px' }}>
          Add Todo
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{
            padding: '10px',
            border: '1px solid #ddd',
            marginBottom: '5px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo)}
              />
              <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                {todo.title}
              </span>
            </div>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
