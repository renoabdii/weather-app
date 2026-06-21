import { c } from '../colors'

const tips = [
  { icon: '☀️', title: 'Sinar UV', desc: 'Gunakan tabir surya saat cuaca cerah antara pukul 10.00 - 14.00' },
  { icon: '🌧️', title: 'Hujan', desc: 'Selalu bawa payung, terutama di musim pancaroba' },
  { icon: '🌡️', title: 'Cuaca Panas', desc: 'Minum air yang cukup dan hindari aktivitas berat di siang hari' },
  { icon: '💨', title: 'Angin Kencang', desc: 'Waspada pohon tumbang dan benda lepas saat angin kencang' },
]

export default function TipsSection() {
  return (
    <section style={{ padding: '0 24px 60px', textAlign: 'center', color: c.text }}>
      <h2 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px' }}>Tips Cuaca</h2>
      <p style={{ fontSize: '15px', opacity: 0.7, margin: '0 0 32px' }}>Tetap siap menghadapi kondisi cuaca apa pun</p>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px', maxWidth: '680px', margin: '0 auto',
      }}>
        {tips.map((t) => (
          <div key={t.title} style={{
            background: c.detailBg, borderRadius: '20px', padding: '24px 20px',
            textAlign: 'left', border: `1px solid ${c.sunBorder}`,
            transition: 'transform 0.2s ease', color: c.text,
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>{t.icon}</div>
            <p style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px' }}>{t.title}</p>
            <p style={{ fontSize: '13px', opacity: 0.7, margin: 0, lineHeight: 1.5 }}>{t.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
