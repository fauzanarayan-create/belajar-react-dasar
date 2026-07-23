import { useState, useEffect } from 'react';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

function UserCrud() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState(null);

  // 1. READ (GET Data)
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.slice(0, 5));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Gagal memuat data:', err);
        setLoading(false);
      });
  }, []);

  // 2. CREATE & UPDATE (POST & PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (editingId) {
      // --- UPDATE DATA ---
      // Update UI lokal terlebih dahulu (Instan!)
      setUsers(users.map((u) => (u.id === editingId ? { ...u, name, email } : u)));
      
      const currentEditId = editingId;
      setEditingId(null);

      // Kirim request ke API di background (Aman dari error)
      try {
        await fetch(`${API_URL}/${currentEditId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email }),
        });
      } catch (err) {
        console.warn('API Fake menolak update ID lokal, tapi UI lokal tetap terupdate:', err);
      }
    } else {
      // --- CREATE DATA ---
      const newUserObj = { id: Date.now(), name, email };
      setUsers([newUserObj, ...users]);

      try {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email }),
        });
      } catch (err) {
        console.warn('Gagal kirim ke API:', err);
      }
    }

    // Reset Form Input
    setName('');
    setEmail('');
  };

  // Persiapan Edit Data
  const handleEdit = (user) => {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);
  };

  // Batalkan Mode Edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setEmail('');
  };

  // 3. DELETE
  const handleDelete = async (id) => {
    // Hapus dari UI lokal dulu
    setUsers(users.filter((user) => user.id !== id));

    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Gagal hapus di API:', err);
    }
  };

  if (loading) {
    return <div style={{ color: '#38bdf8', textAlign: 'center', padding: '20px' }}>⏳ Memuat data...</div>;
  }

  return (
    <div style={{ maxWidth: '650px', margin: '30px auto', fontFamily: 'Arial, sans-serif', color: '#f8fafc' }}>
      <h2 style={{ color: '#38bdf8', textAlign: 'center' }}>⚡ Manajemen User (CRUD + API)</h2>

      {/* FORM INPUT */}
      <form onSubmit={handleSubmit} style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
        <h4 style={{ margin: '0 0 12px 0', color: editingId ? '#f59e0b' : '#38bdf8' }}>
          {editingId ? '✏️ Edit User' : '➕ Tambah User Baru'}
        </h4>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ flex: 1, padding: '8px 12px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
          />
          <input
            type="email"
            placeholder="Alamat Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ flex: 1, padding: '8px 12px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="submit" style={{ padding: '8px 16px', backgroundColor: editingId ? '#f59e0b' : '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {editingId ? 'Simpan Perubahan' : 'Tambah'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} style={{ padding: '8px 16px', backgroundColor: '#64748b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Batal
            </button>
          )}
        </div>
      </form>

      {/* DAFTAR USER */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {users.map((user) => (
          <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: '12px 16px', borderRadius: '6px' }}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{user.name}</div>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>✉️ {user.email}</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleEdit(user)} style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                Edit
              </button>
              <button onClick={() => handleDelete(user.id)} style={{ backgroundColor: '#f43f5e', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserCrud;