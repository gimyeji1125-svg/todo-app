const BASE_URL = '/api/todos';

async function request(path, options) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export function fetchTodos(filter) {
  const query = filter === 'all' || !filter ? '' : `?completed=${filter === 'completed'}`;
  return request(query);
}

export function createTodo(data) {
  return request('', { method: 'POST', body: JSON.stringify(data) });
}

export function updateTodo(id, data) {
  return request(`/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export function deleteTodo(id) {
  return request(`/${id}`, { method: 'DELETE' });
}
