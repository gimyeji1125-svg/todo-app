const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'active', label: '진행중' },
  { key: 'completed', label: '완료' },
];

export default function FilterBar({ filter, onChange }) {
  return (
    <div className="filter-bar">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          className={filter === f.key ? 'active' : ''}
          onClick={() => onChange(f.key)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
