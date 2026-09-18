import { Router } from 'express';
import db from '../db.js';

const router = Router();

const ALLOWED_PRIORITIES = new Set(['low', 'medium', 'high']);

function serialize(row) {
  return { ...row, completed: Boolean(row.completed) };
}

// GET /api/todos?completed=true&sort=due_date
router.get('/', (req, res) => {
  const { completed, sort } = req.query;

  let query = 'SELECT * FROM todos';
  const params = [];

  if (completed === 'true' || completed === 'false') {
    query += ' WHERE completed = ?';
    params.push(completed === 'true' ? 1 : 0);
  }

  const sortColumns = { due_date: 'due_date', created_at: 'created_at', priority: 'priority' };
  query += ` ORDER BY ${sortColumns[sort] ?? 'created_at'} DESC`;

  const rows = db.prepare(query).all(...params);
  res.json(rows.map(serialize));
});

// GET /api/todos/:id
router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM todos WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(serialize(row));
});

// POST /api/todos
router.post('/', (req, res) => {
  const { title, priority = 'medium', due_date = null } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }
  if (!ALLOWED_PRIORITIES.has(priority)) {
    return res.status(400).json({ error: 'invalid priority' });
  }

  const result = db
    .prepare('INSERT INTO todos (title, priority, due_date) VALUES (?, ?, ?)')
    .run(title.trim(), priority, due_date);

  const row = db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(serialize(row));
});

// PATCH /api/todos/:id
router.patch('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });

  const { title, completed, priority, due_date } = req.body;

  if (priority !== undefined && !ALLOWED_PRIORITIES.has(priority)) {
    return res.status(400).json({ error: 'invalid priority' });
  }
  if (title !== undefined && !title.trim()) {
    return res.status(400).json({ error: 'title cannot be empty' });
  }

  const next = {
    title: title !== undefined ? title.trim() : existing.title,
    completed: completed !== undefined ? (completed ? 1 : 0) : existing.completed,
    priority: priority !== undefined ? priority : existing.priority,
    due_date: due_date !== undefined ? due_date : existing.due_date,
  };

  db.prepare(
    `UPDATE todos SET title = ?, completed = ?, priority = ?, due_date = ?, updated_at = datetime('now')
     WHERE id = ?`
  ).run(next.title, next.completed, next.priority, next.due_date, req.params.id);

  const row = db.prepare('SELECT * FROM todos WHERE id = ?').get(req.params.id);
  res.json(serialize(row));
});

// DELETE /api/todos/:id
router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM todos WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

export default router;
