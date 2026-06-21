import type { WeatherData } from '../types/weather'
import { c } from '../colors'
import WeatherResult from './WeatherResult'

export type Suggestion = {
  name: string
  country: string
  state?: string
}

type Props = {
  city: string
  onCityChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
  error: string
  weather: WeatherData | null
  suggestions?: Suggestion[]
  showSuggestions?: boolean
  selectedIndex?: number
  onSuggestionSelect?: (s: Suggestion) => void
  onInputKeyDown?: (e: React.KeyboardEvent) => void
  onInputBlur?: () => void
}

export default function SearchCard({
  city, onCityChange, onSubmit, loading, error, weather,
  suggestions = [], showSuggestions = false, selectedIndex = -1,
  onSuggestionSelect, onInputKeyDown, onInputBlur,
}: Props) {
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
      <div style={{ position: 'relative' }}>
        <form onSubmit={onSubmit} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text" value={city} onChange={(e) => onCityChange(e.target.value)}
            placeholder="Cari kota..."
            onKeyDown={onInputKeyDown}
            onFocus={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.6)'; e.target.style.background = 'rgba(255,255,255,0.25)' }}
            onBlur={(e) => {
              e.target.style.borderColor = c.inputBorder
              e.target.style.background = c.inputBg
              onInputBlur?.()
            }}
            style={{
              flex: 1, padding: '14px 20px', border: `1.5px solid ${c.inputBorder}`,
              borderRadius: '14px', fontSize: '15px', outline: 'none',
              background: c.inputBg, color: c.text, transition: 'all 0.3s ease',
            }}
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

        {showSuggestions && suggestions.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            marginTop: '8px', zIndex: 100,
            background: 'rgba(20, 20, 40, 0.95)',
            backdropFilter: 'blur(24px)',
            borderRadius: '14px',
            border: `1px solid ${c.cardBorder}`,
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.4)',
            overflow: 'hidden',
          }}>
            {suggestions.map((s, i) => (
              <div key={`${s.name}-${s.country}-${s.state || ''}`}
                onMouseDown={() => onSuggestionSelect?.(s)}
                style={{
                  padding: '12px 16px', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  fontSize: '14px', color: c.text,
                  background: selectedIndex === i ? 'rgba(255,255,255,0.12)' : 'transparent',
                  borderBottom: i < suggestions.length - 1 ? `1px solid ${c.cardBorder}` : 'none',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => { if (selectedIndex !== i) e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                onMouseLeave={(e) => { if (selectedIndex !== i) e.currentTarget.style.background = 'transparent' }}
              >
                <span>{s.name}{s.state ? `, ${s.state}` : ''}</span>
                <span style={{
                  fontSize: '12px', opacity: 0.6,
                  background: s.country === 'ID' ? 'rgba(255, 200, 0, 0.15)' : 'transparent',
                  color: s.country === 'ID' ? '#ffd700' : c.textMuted,
                  padding: '2px 8px', borderRadius: '8px',
                }}>
                  {s.country === 'ID' ? 'Indonesia' : s.country}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

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
