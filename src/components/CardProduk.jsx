function CardProduk({ nama, harga, kategori }) {
  return (
    <div style={{
      border: '1px solid #00bcd4',
      borderRadius: '8px',
      padding: '12px',
      minWidth: '180px',
      backgroundColor: '#1e1e1e',
      color: '#fff'
    }}>
      <h4 style={{ margin: '0 0 8px 0', color: '#00bcd4' }}>{nama}</h4>
      <p style={{ margin: '4px 0' }}>Harga: Rp {harga}</p>
      <small style={{ color: '#aaa' }}>Kategori: {kategori}</small>
    </div>
  );
}

export default CardProduk;