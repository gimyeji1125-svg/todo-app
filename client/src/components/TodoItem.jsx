import { useState } from 'react';

const PRIORITY_LABEL = { low: '낮음', medium: '보통', high: '높음' };

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);

  function submitEdit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== todo.title) {
      onEdit(todo.id, { title: trimmed });
    } else {
      setDraft(todo.title);
    }
    setIsEditing(false);
  }

  return (
    <li className={`todo-item priority-${todo.priority} ${todo.completed ? 'completed' : ''}`}>
      <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo)} />

      {isEditing ? (
        <input
          className="edit-input"
          value={draft}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onBlur={submitEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submitEdit();
            if (e.key === 'Escape') {
              setDraft(todo.title);
              setIsEditing(false);
            }
          }}
        />
      ) : (
        <span className="title" onDoubleClick={() => setIsEditing(true)}>
          {todo.title}
        </span>
      )}

      <span className="badge">{PRIORITY_LABEL[todo.priority]}</span>
      {todo.due_date && <span className="due-date">{todo.due_date}</span>}

      <button className="delete-btn" onClick={() => onDelete(todo.id)} aria-label="삭제">
        ✕
      </button>
    </li>
  );
}
