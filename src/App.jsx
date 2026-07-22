import { useState, useEffect } from 'react';
import CardProduk from './components/CardProduk';

function App() {
  const [counter, setCounter] = useState(0);
  const [showSection, setShowSection] = useState(true);
  const [produkList, setProdukList] = useState([]);

  useEffect(() => {
    const dataAwal = [
      { id: 1, nama: 'Laptop Gaming', harga: '15.000.000', kategori: 'Elektronik' },
      { id: 2, nama: 'Mouse Wireless', harga: '250.000', kategori: 'Aksesori' },
      { id: 3, nama: 'Keyboard Mechanical', harga: '750.000', kategori: 'Aksesori' },
    ];
    setProdukList(dataAwal);
  }, []);

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>⚡ Pembelajaran Dasar React JS</h1>

      <button 
        onClick={() => setShowSection(!showSection)}
        style={{ padding: '8px 16px', cursor: 'pointer', marginBottom: '16px' }}
      >
        {showSection ? 'Sembunyikan Demo State' : 'Tampilkan Demo State'}
      </button>

      {showSection && (
        <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <h3>1. State & Event Handling</h3>
          <p>Jumlah Klik State: <strong>{counter}</strong></p>
          <button onClick={() => setCounter(counter + 1)} style={{ marginRight: '8px', padding: '6px 12px' }}>
            Tambah Counter
          </button>
          <button onClick={() => setCounter(0)} style={{ padding: '6px 12px' }}>
            Reset
          </button>
        </div>
      )}

      <h3>2. List & Key + Props Component</h3>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {produkList.map((item) => (
          <CardProduk 
            key={item.id} 
            nama={item.nama} 
            harga={item.harga} 
            kategori={item.kategori} 
          />
        ))}
      </div>
    </div>
  );
}

export default App;