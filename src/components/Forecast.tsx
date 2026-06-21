import type { ForecastDay } from '../types/weather'
import { c } from '../colors'

const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

function getDayName(dateStr: string): string {
  return dayNames[new Date(dateStr + 'T12:00:00').getDay()]
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

type Props = { forecast: ForecastDay[] }

export default function Forecast({ forecast }: Props) {
  return (
    <section className="fade-in-up" style={{ padding: '40px 0', color: c.text, maxWidth: '680px', margin: '0 auto', width: '100%' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px', textAlign: 'center' }}>Prakiraan 5 Hari</h2>
      <p style={{ fontSize: '15px', opacity: 0.7, margin: '0 0 28px', textAlign: 'center' }}>Perkiraan cuaca untuk beberapa hari ke depan</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
        {forecast.map((day) => (
          <div key={day.date} style={{
            background: c.detailBg, borderRadius: '18px', padding: '18px 12px',
            textAlign: 'center', border: `1px solid ${c.sunBorder}`, transition: 'transform 0.2s ease',
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700 }}>{getDayName(day.date)}</p>
            <p style={{ margin: '0 0 8px', fontSize: '11px', opacity: 0.5 }}>{formatDate(day.date)}</p>
            <img src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
              alt={day.description} style={{ width: '56px', height: '56px', margin: '0 auto' }} />
            <p style={{ margin: '4px 0 0', fontSize: '22px', fontWeight: 700 }}>{Math.round(day.temp)}°</p>
            <p style={{ margin: '2px 0 8px', fontSize: '11px', opacity: 0.6 }}>{Math.round(day.tempMin)}° / {Math.round(day.tempMax)}°</p>
            <p style={{ margin: 0, fontSize: '12px', opacity: 0.75, textTransform: 'capitalize' }}>{day.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
