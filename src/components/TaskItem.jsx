function TaskItem({ task, onToggle, onHapus }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        marginBottom: '8px',
        borderRadius: '6px',
        backgroundColor: '#1e293b',
        borderLeft: task.completed ? '4px solid #4ade80' : '4px solid #38bdf8'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          style={{ cursor: 'pointer', width: '18px', height: '18px' }}
        />
        
        {/* Conditional Styling berdasarkan status completed */}
        <span
          style={{
            color: task.completed ? '#94a3b8' : '#f8fafc',
            textDecoration: task.completed ? 'line-through' : 'none',
            fontSize: '16px'
          }}
        >
          {task.title}
        </span>
      </div>

      <button
        onClick={() => onHapus(task.id)}
        style={{
          backgroundColor: '#f43f5e',
          color: '#ffffff',
          border: 'none',
          borderRadius: '4px',
          padding: '6px 12px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Hapus
      </button>
    </div>
  );
}

export default TaskItem;