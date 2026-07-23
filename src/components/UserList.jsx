import { useState, useEffect } from 'react';

function UserList() {
  // 1. Tiga State Wajib untuk API
  const [users, setUsers] = useState([]);      // Menampung data dari API
  const [loading, setLoading] = useState(true); // Indikator status loading
  const [error, setError] = useState(null);    // Menampung pesan error jika ada

  // 2. useEffect untuk Fetching Data saat komponen pertama kali di-load
  useEffect(() => {
    // Fungsi async untuk mengambil data
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        // Cek jika response HTTP tidak OK (misal 404 atau 500)
        if (!response.ok) {
          throw new Error('Gagal mengambil data dari server');
        }

        const data = await response.json();
        setUsers(data); // Simpan data ke state
      } catch (err) {
        setError(err.message); // Simpan pesan error jika gagal
      } finally {
        setLoading(false); // Matikan status loading (baik sukses maupun gagal)
      }
    };

    fetchUsers();
  }, []); // Array kosong [] artinya fungsi ini CUMA JALAN 1 KALI saat komponen muncul

  // 3. Handling Kondisi Loading
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#38bdf8' }}>
        ⏳ Memuat data user dari server...
      </div>
    );
  }

  // 4. Handling Kondisi Error
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#f43f5e' }}>
        ⚠️ Terjadi Kesalahan: {error}
      </div>
    );
  }

  // 5. Handling Kondisi Berhasil (Render Data)
  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h3 style={{ color: '#38bdf8', textAlign: 'center' }}>👥 Daftar Pengguna (API)</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {users.map((user) => (
          <div
            key={user.id}
            style={{
              padding: '12px 16px',
              backgroundColor: '#1e293b',
              borderRadius: '8px',
              borderLeft: '4px solid #38bdf8',
              color: '#f8fafc'
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{user.name}</div>
            <div style={{ fontSize: '13px', color: '#94a3b8' }}>✉️ {user.email}</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              🏢 {user.company.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;