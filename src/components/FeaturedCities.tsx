import type { FeaturedCity } from '../types/weather'
import { c } from '../colors'

const cities: FeaturedCity[] = [
  { name: 'Jakarta', country: 'ID' },
  { name: 'Tokyo', country: 'JP' },
  { name: 'London', country: 'GB' },
  { name: 'New York', country: 'US' },
  { name: 'Dubai', country: 'AE' },
  { name: 'Paris', country: 'FR' },
]

type Props = { onSelect: (city: string) => void }

export default function FeaturedCities({ onSelect }: Props) {
  return (
    <section style={{ padding: '60px 24px', textAlign: 'center', color: c.text }}>
      <h2 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px' }}>Kota Populer</h2>
      <p style={{ fontSize: '15px', opacity: 0.7, margin: '0 0 32px' }}>Klik untuk melihat cuaca kota-kota besar dunia</p>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', maxWidth: '680px', margin: '0 auto' }}>
        {cities.map((city) => (
          <button key={city.name} style={{
            padding: '12px 24px', background: c.chipBg,
            border: `1px solid ${c.chipBorder}`, borderRadius: '50px',
            cursor: 'pointer', fontSize: '14px', fontWeight: 600,
            transition: 'all 0.2s ease', color: c.text,
          }}
            onClick={() => onSelect(city.name)}
            onMouseEnter={(e) => { e.currentTarget.style.background = c.accent; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = c.chipBg; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            {city.name}, {city.country}
          </button>
        ))}
      </div>
    </section>
  )
}
