const STORAGE_KEY = 'todos';
const ALLOWED_PRIORITIES = new Set(['low', 'medium', 'high']);

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAll(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function nextId(todos) {
  return todos.reduce((max, t) => Math.max(max, t.id), 0) + 1;
}

function nowIso() {
  return new Date().toISOString();
}

export async function fetchTodos(filter) {
  const todos = loadAll();
  const filtered =
    filter === 'active'
      ? todos.filter((t) => !t.completed)
      : filter === 'completed'
        ? todos.filter((t) => t.completed)
        : todos;
  return [...filtered].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export async function createTodo(data) {
  const { title, priority = 'medium', due_date = null } = data;

  if (!title || !title.trim()) {
    throw new Error('title is required');
  }
  if (!ALLOWED_PRIORITIES.has(priority)) {
    throw new Error('invalid priority');
  }

  const todos = loadAll();
  const todo = {
    id: nextId(todos),
    title: title.trim(),
    completed: false,
    priority,
    due_date,
    created_at: nowIso(),
    updated_at: nowIso(),
  };
  todos.push(todo);
  saveAll(todos);
  return todo;
}

export async function updateTodo(id, data) {
  const todos = loadAll();
  const index = todos.findIndex((t) => t.id === Number(id));
  if (index === -1) throw new Error('Not found');

  const { title, completed, priority, due_date } = data;

  if (priority !== undefined && !ALLOWED_PRIORITIES.has(priority)) {
    throw new Error('invalid priority');
  }
  if (title !== undefined && !title.trim()) {
    throw new Error('title cannot be empty');
  }

  const existing = todos[index];
  const updated = {
    ...existing,
    title: title !== undefined ? title.trim() : existing.title,
    completed: completed !== undefined ? Boolean(completed) : existing.completed,
    priority: priority !== undefined ? priority : existing.priority,
    due_date: due_date !== undefined ? due_date : existing.due_date,
    updated_at: nowIso(),
  };
  todos[index] = updated;
  saveAll(todos);
  return updated;
}

export async function deleteTodo(id) {
  const todos = loadAll();
  const next = todos.filter((t) => t.id !== Number(id));
  if (next.length === todos.length) throw new Error('Not found');
  saveAll(next);
  return null;
}
