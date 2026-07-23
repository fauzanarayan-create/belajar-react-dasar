import { useState } from 'react';

function TaskForm({ onTambahTask }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Mencegah reload halaman
    if (!text.trim()) return; // Validasi jika input kosong

    // Kirim data tugas baru ke komponen induk (Parent)
    onTambahTask(text);
    setText(''); // Reset input
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Tulis tugas baru..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          flex: 1,
          padding: '10px',
          borderRadius: '6px',
          border: '1px solid #334155',
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          outline: 'none'
        }}
      />
      <button
        type="submit"
        style={{
          padding: '10px 20px',
          backgroundColor: '#0284c7',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Tambah
      </button>
    </form>
  );
}

export default TaskForm;
