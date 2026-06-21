import type { WeatherData } from '../types/weather'
import { getWindLabel, formatTime } from '../utils/weather'
import { c } from '../colors'

type Props = { weather: WeatherData }

export default function WeatherResult({ weather }: Props) {
  const items = [
    { label: 'Kelembaban', value: `${weather.main.humidity}%` },
    { label: 'Angin', value: `${weather.wind.speed} m/s`, sub: getWindLabel(weather.wind.speed) },
    { label: 'Tekanan', value: `${weather.main.pressure} hPa` },
    { label: 'Visibilitas', value: `${(weather.visibility / 1000).toFixed(1)} km` },
  ]

  return (
    <div className="fade-in-up" style={{ marginTop: '24px' }}>
      <div style={{
        background: c.cardBg, backdropFilter: 'blur(24px)',
        borderRadius: '24px', padding: '32px',
        border: `1px solid ${c.cardBorder}`, color: c.text,
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 700, margin: 0 }}>
            {weather.name}<span style={{ fontWeight: 400, opacity: 0.7 }}>, {weather.sys.country}</span>
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '4px' }}>
          <p style={{ fontSize: '74px', fontWeight: 700, letterSpacing: '-3px', lineHeight: 1, margin: 0 }}>
            {Math.round(weather.main.temp)}°
          </p>
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
            alt={weather.weather[0].description} style={{ width: '90px', height: '90px' }} />
        </div>
        <p style={{ textAlign: 'center', fontSize: '16px', textTransform: 'capitalize', opacity: 0.85, margin: '0 0 6px' }}>
          {weather.weather[0].description}
        </p>
        <p style={{ textAlign: 'center', fontSize: '13px', opacity: 0.65, margin: '0 0 24px' }}>
          Terasa {Math.round(weather.main.feels_like)}°C &middot; Min {Math.round(weather.main.temp_min)}° / Maks {Math.round(weather.main.temp_max)}°
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          {items.map((item) => (
            <div key={item.label} style={{
              background: c.detailBg, borderRadius: '14px', padding: '14px',
              textAlign: 'center', transition: 'transform 0.2s ease',
            }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <p style={{ margin: 0, fontSize: '11px', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {item.label}
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 700 }}>{item.value}</p>
              {item.sub && <p style={{ margin: '2px 0 0', fontSize: '11px', opacity: 0.5 }}>{item.sub}</p>}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', paddingTop: '16px', borderTop: `1px solid ${c.sunBorder}` }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '20px' }}>🌅</p>
            <p style={{ margin: '4px 0 0', fontSize: '13px', fontWeight: 600 }}>{formatTime(weather.sys.sunrise, weather.timezone)}</p>
            <p style={{ margin: '2px 0 0', fontSize: '11px', opacity: 0.5 }}>Matahari terbit</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '20px' }}>🌇</p>
            <p style={{ margin: '4px 0 0', fontSize: '13px', fontWeight: 600 }}>{formatTime(weather.sys.sunset, weather.timezone)}</p>
            <p style={{ margin: '2px 0 0', fontSize: '11px', opacity: 0.5 }}>Matahari terbenam</p>
          </div>
        </div>
      </div>
    </div>
  )
}
