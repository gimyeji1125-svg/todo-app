import { useState } from 'react';

export default function TodoInput({ onAdd }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), priority, due_date: dueDate || null });
    setTitle('');
    setPriority('medium');
    setDueDate('');
  }

  return (
    <form className="todo-input" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="할 일을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">낮음</option>
        <option value="medium">보통</option>
        <option value="high">높음</option>
      </select>
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <button type="submit">추가</button>
    </form>
  );
}
