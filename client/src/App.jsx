import { useEffect, useState, useCallback } from 'react';
import TodoInput from './components/TodoInput.jsx';
import TodoList from './components/TodoList.jsx';
import FilterBar from './components/FilterBar.jsx';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './api.js';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    fetchTodos(filter)
      .then(setTodos)
      .catch((err) => setError(err.message));
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAdd(data) {
    try {
      await createTodo(data);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggle(todo) {
    try {
      await updateTodo(todo.id, { completed: !todo.completed });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleEdit(id, data) {
    try {
      await updateTodo(id, data);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTodo(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="app">
      <h1>할 일 목록</h1>
      <TodoInput onAdd={handleAdd} />
      <FilterBar filter={filter} onChange={setFilter} />
      {error && <p className="error">{error}</p>}
      <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit} />
      <p className="summary">{remaining}개 남음</p>
    </div>
  );
}
