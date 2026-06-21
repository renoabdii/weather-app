import { getGreeting } from '../utils/weather'
import { c } from '../colors'

export default function Hero() {
  return (
    <div className="fade-in-up" style={{ textAlign: 'center', maxWidth: '600px', marginBottom: '48px' }}>
      <p style={{ fontSize: '18px', opacity: 0.85, marginBottom: '8px', fontWeight: 500, color: c.text }}>
        {getGreeting()}!
      </p>
      <h1 style={{ fontSize: '48px', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-1px', lineHeight: 1.15, color: c.text }}>
        Cek Cuaca<br />di Mana Saja
      </h1>
      <p style={{ fontSize: '16px', opacity: 0.7, margin: 0, lineHeight: 1.6, color: c.text }}>
        Dapatkan informasi cuaca terkini untuk kota Anda<br />
        dengan tampilan yang modern dan mudah dipahami
      </p>
    </div>
  )
}
