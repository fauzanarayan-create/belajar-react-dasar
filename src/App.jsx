import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

// ==========================================
// 1. CONTEXT API (Tema Global Dark/Light)
// ==========================================
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ==========================================
// 2. NAVBAR GLOBAL
// ==========================================
function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <nav style={{
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      boxShadow: isDark ? 'none' : '0 2px 4px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: isDark ? '#38bdf8' : '#0284c7', textDecoration: 'none', fontWeight: 'bold' }}>🏠 Daftar User</Link>
        <Link to="/crud" style={{ color: isDark ? '#fff' : '#0f172a', textDecoration: 'none', fontWeight: 'bold' }}>⚡ Kelola (CRUD)</Link>
        <Link to="/about" style={{ color: isDark ? '#fff' : '#0f172a', textDecoration: 'none', fontWeight: 'bold' }}>ℹ️ Tentang</Link>
      </div>

      <button
        onClick={toggleTheme}
        style={{
          padding: '8px 16px',
          backgroundColor: isDark ? '#f59e0b' : '#0284c7',
          color: '#fff',
          border: 'none',
          borderRadius: '20px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'all 0.2s'
        }}
      >
        {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
    </nav>
  );
}

// ==========================================
// 3. HALAMAN 1: DAFTAR USER + SEARCH + PAGINASI
// ==========================================
function UserList() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Pencarian
  const [searchTerm, setSearchTerm] = useState('');

  // State Paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Jumlah user per halaman

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  // 1. Filter data berdasarkan pencarian
  const filteredUsers = users.filter((u) => {
    const keyword = searchTerm.toLowerCase();
    return u.name.toLowerCase().includes(keyword) || u.email.toLowerCase().includes(keyword);
  });

  // Trik UX: Reset ke halaman 1 setiap kali mengetik pencarian baru
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // 2. Hitung logika Paginasi dari data yang sudah di-filter
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  if (loading) {
    return <div style={{ color: isDark ? '#38bdf8' : '#0284c7', textAlign: 'center', padding: '40px' }}>⏳ Memuat data user dari API...</div>;
  }

  return (
    <div style={{ maxWidth: '650px', margin: '30px auto', padding: '0 16px' }}>
      <h2 style={{ color: isDark ? '#38bdf8' : '#0284c7', textAlign: 'center', marginBottom: '20px' }}>
        👥 Daftar Pengguna Real (API)
      </h2>

      {/* INPUT PENCARIAN */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="🔍 Cari nama atau email user..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#f8fafc' : '#0f172a',
            fontSize: '15px',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* DAFTAR USER HASIL PAGINASI */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {currentUsers.length > 0 ? (
          currentUsers.map((u) => (
            <div
              key={u.id}
              style={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                padding: '16px 20px',
                borderRadius: '8px',
                borderLeft: '4px solid #38bdf8',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: isDark ? 'none' : '0 2px 5px rgba(0,0,0,0.05)',
                transition: 'all 0.3s'
              }}
            >
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: isDark ? '#f8fafc' : '#0f172a' }}>
                  {u.name}
                </h3>
                <p style={{ margin: 0, color: isDark ? '#94a3b8' : '#64748b', fontSize: '14px' }}>
                  ✉️ {u.email}
                </p>
              </div>
              <Link
                to={`/user/${u.id}`}
                style={{
                  backgroundColor: '#0284c7',
                  color: '#fff',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '13px'
                }}
              >
                Detail →
              </Link>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', color: isDark ? '#94a3b8' : '#64748b', padding: '20px' }}>
            ❌ Tidak ditemukan user dengan kata kunci "<strong>{searchTerm}</strong>"
          </div>
        )}
      </div>

      {/* KONTROL NAVIGASI PAGINASI */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '24px' }}>
          {/* Tombol Prev */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: currentPage === 1 ? '#64748b' : '#0284c7',
              color: '#fff',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            ← Prev
          </button>

          {/* Tombol Angka Halaman (1, 2, 3...) */}
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: currentPage === page ? '#38bdf8' : (isDark ? '#1e293b' : '#e2e8f0'),
                color: currentPage === page ? '#0f172a' : (isDark ? '#fff' : '#0f172a'),
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {page}
            </button>
          ))}

          {/* Tombol Next */}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: currentPage === totalPages ? '#64748b' : '#0284c7',
              color: '#fff',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. HALAMAN 2: DETAIL USER DINAMIS (/user/:id)
// ==========================================
function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div style={{ color: isDark ? '#38bdf8' : '#0284c7', textAlign: 'center', padding: '40px' }}>⏳ Memuat profil ID #{id}...</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', backgroundColor: isDark ? '#1e293b' : '#ffffff', padding: '24px', borderRadius: '10px', boxShadow: isDark ? 'none' : '0 4px 10px rgba(0,0,0,0.08)', transition: 'all 0.3s' }}>
      <h2 style={{ color: isDark ? '#38bdf8' : '#0284c7', marginTop: 0, borderBottom: isDark ? '1px solid #334155' : '1px solid #e2e8f0', paddingBottom: '12px' }}>
        👤 Profil Detail: {user?.name}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0', color: isDark ? '#cbd5e1' : '#334155' }}>
        <p style={{ margin: 0 }}><strong>ID:</strong> {user?.id}</p>
        <p style={{ margin: 0 }}><strong>Username:</strong> @{user?.username}</p>
        <p style={{ margin: 0 }}><strong>Email:</strong> {user?.email}</p>
        <p style={{ margin: 0 }}><strong>Telepon:</strong> {user?.phone}</p>
        <p style={{ margin: 0 }}><strong>Website:</strong> {user?.website}</p>
        <p style={{ margin: 0 }}><strong>Perusahaan:</strong> {user?.company?.name}</p>
        <p style={{ margin: 0 }}><strong>Kota:</strong> {user?.address?.city}</p>
      </div>
      <button onClick={() => navigate('/')} style={{ padding: '10px 18px', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
        ← Kembali ke Daftar User
      </button>
    </div>
  );
}

// ==========================================
// 5. HALAMAN 3: MANAJEMEN USER (CRUD) + SEARCH + PAGINASI
// ==========================================
function UserCrud() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState(null);

  // State Pencarian & Paginasi
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // 3 item per halaman

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.slice(0, 10)); // Mengambil 10 data awal agar paginasi terasa
        setLoading(false);
      });
  }, []);

  // Handler Submit Form (Tambah / Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (editingId) {
      setUsers(users.map((u) => (u.id === editingId ? { ...u, name, email } : u)));
      const curId = editingId;
      setEditingId(null);
      try {
        await fetch(`${API_URL}/${curId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email }) });
      } catch (err) { console.warn(err); }
    } else {
      setUsers([{ id: Date.now(), name, email }, ...users]);
      try {
        await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email }) });
      } catch (err) { console.warn(err); }
    }
    setName('');
    setEmail('');
  };

  const handleEdit = (u) => { setEditingId(u.id); setName(u.name); setEmail(u.email); };
  
  const handleDelete = async (id) => {
    setUsers(users.filter((u) => u.id !== id));
    try { await fetch(`${API_URL}/${id}`, { method: 'DELETE' }); } catch (err) { console.warn(err); }
  };

  // 1. Filter Data Berdasarkan Pencarian
  const filteredUsers = users.filter((u) => {
    const keyword = searchTerm.toLowerCase();
    return u.name.toLowerCase().includes(keyword) || u.email.toLowerCase().includes(keyword);
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset ke halaman 1 saat mengetik
  };

  // 2. Hitung Paginasi
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  if (loading) return <div style={{ color: isDark ? '#38bdf8' : '#0284c7', textAlign: 'center', padding: '40px' }}>⏳ Memuat CRUD...</div>;

  return (
    <div style={{ maxWidth: '650px', margin: '30px auto', padding: '0 16px' }}>
      <h2 style={{ color: isDark ? '#38bdf8' : '#0284c7', textAlign: 'center' }}>⚡ Kelola User (CRUD)</h2>
      
      {/* FORM INPUT (CREATE / UPDATE) */}
      <form onSubmit={handleSubmit} style={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', padding: '16px', borderRadius: '8px', marginBottom: '20px', boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h4 style={{ margin: '0 0 12px 0', color: editingId ? '#f59e0b' : (isDark ? '#38bdf8' : '#0284c7') }}>
          {editingId ? '✏️ Edit User' : '➕ Tambah User Baru'}
        </h4>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <input type="text" placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} style={{ flex: 1, padding: '8px 12px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: isDark ? '#0f172a' : '#f8fafc', color: isDark ? '#fff' : '#0f172a' }} />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ flex: 1, padding: '8px 12px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: isDark ? '#0f172a' : '#f8fafc', color: isDark ? '#fff' : '#0f172a' }} />
        </div>
        <button type="submit" style={{ padding: '8px 16px', backgroundColor: editingId ? '#f59e0b' : '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          {editingId ? 'Simpan Perubahan' : 'Tambah'}
        </button>
      </form>

      {/* INPUT PENCARIAN DATATABLE */}
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="🔍 Cari nama atau email di data CRUD..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '6px',
            border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#f8fafc' : '#0f172a',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* DAFTAR USER HASIL FILTER & PAGINASI */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {currentUsers.length > 0 ? (
          currentUsers.map((u) => (
            <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: isDark ? '#1e293b' : '#ffffff', padding: '12px 16px', borderRadius: '6px', boxShadow: isDark ? 'none' : '0 2px 5px rgba(0,0,0,0.05)' }}>
              <div>
                <div style={{ fontWeight: 'bold', color: isDark ? '#fff' : '#0f172a' }}>{u.name}</div>
                <div style={{ fontSize: '13px', color: isDark ? '#94a3b8' : '#64748b' }}>✉️ {u.email}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleEdit(u)} style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDelete(u.id)} style={{ backgroundColor: '#f43f5e', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Hapus</button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', color: isDark ? '#94a3b8' : '#64748b', padding: '16px' }}>
            ❌ Data tidak ditemukan untuk kata kunci "<strong>{searchTerm}</strong>"
          </div>
        )}
      </div>

      {/* NAVIGASI PAGINASI */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: currentPage === 1 ? '#64748b' : '#0284c7',
              color: '#fff',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '13px'
            }}
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: currentPage === page ? '#38bdf8' : (isDark ? '#1e293b' : '#e2e8f0'),
                color: currentPage === page ? '#0f172a' : (isDark ? '#fff' : '#0f172a'),
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '13px'
              }}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: currentPage === totalPages ? '#64748b' : '#0284c7',
              color: '#fff',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '13px'
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 6. HALAMAN 4: TENTANG
// ==========================================
function About() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', backgroundColor: isDark ? '#1e293b' : '#ffffff', padding: '24px', borderRadius: '8px', transition: 'all 0.3s' }}>
      <h2 style={{ color: isDark ? '#38bdf8' : '#0284c7' }}>ℹ️ Tentang Aplikasi</h2>
      <p style={{ color: isDark ? '#cbd5e1' : '#334155' }}>
        Aplikasi ini menggabungkan <strong>API Fetching</strong>, <strong>Fitur CRUD</strong>, <strong>React Router v6</strong>, dan <strong>Context API (Dark/Light Mode)</strong> secara terintegrasi!
      </p>
    </div>
  );
}

// ==========================================
// 7. MAIN LAYOUT & ROUTING
// ==========================================
function MainLayout() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <div style={{
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      color: isDark ? '#f8fafc' : '#0f172a',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      transition: 'all 0.3s ease'
    }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/user/:id" element={<UserDetail />} />
        <Route path="/crud" element={<UserCrud />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </ThemeProvider>
  );
}