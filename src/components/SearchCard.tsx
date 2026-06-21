import type { WeatherData } from '../types/weather'
import { c } from '../colors'
import WeatherResult from './WeatherResult'

type Props = {
  city: string
  onCityChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
  error: string
  weather: WeatherData | null
}

export default function SearchCard({ city, onCityChange, onSubmit, loading, error, weather }: Props) {
  return (
    <div className="fade-in-up" style={{
      background: c.cardBg,
      backdropFilter: 'blur(24px)',
      borderRadius: '24px',
      padding: '32px',
      width: '100%',
      maxWidth: '520px',
      border: `1px solid ${c.cardBorder}`,
      boxShadow: '0 30px 60px -15px rgba(0,0,0,0.3)',
    }}>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text" value={city} onChange={(e) => onCityChange(e.target.value)}
          placeholder="Cari kota..."
          style={{
            flex: 1, padding: '14px 20px', border: `1.5px solid ${c.inputBorder}`,
            borderRadius: '14px', fontSize: '15px', outline: 'none',
            background: c.inputBg, color: c.text, transition: 'all 0.3s ease',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.6)'; e.target.style.background = 'rgba(255,255,255,0.25)' }}
          onBlur={(e) => { e.target.style.borderColor = c.inputBorder; e.target.style.background = c.inputBg }}
        />
        <button type="submit" disabled={loading} style={{
          padding: '14px 24px', background: c.accent, color: c.text,
          border: `1.5px solid ${c.cardBorder}`, borderRadius: '14px',
          fontSize: '15px', fontWeight: 600, cursor: 'pointer',
          transition: 'all 0.3s ease', whiteSpace: 'nowrap',
        }}
          onMouseEnter={(e) => e.currentTarget.style.background = c.accentHover}
          onMouseLeave={(e) => e.currentTarget.style.background = c.accent}
        >
          {loading ? '🔄' : 'Cari'}
        </button>
      </form>

      {error && (
        <p style={{ textAlign: 'center', background: c.errorBg, padding: '12px', borderRadius: '12px', fontSize: '14px', color: c.errorText, marginTop: '16px', marginBottom: 0 }}>
          {error}
        </p>
      )}

      {loading && !error && (
        <div style={{
          width: '36px', height: '36px', border: `3px solid ${c.spinnerBorder}`,
          borderTopColor: c.spinnerTop, borderRadius: '50%',
          animation: 'spin 0.8s linear infinite', margin: '20px auto',
        }} />
      )}

      {weather && !loading && <WeatherResult weather={weather} />}
    </div>
  )
}
