import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { WeatherData } from '../types/weather'
import { c } from '../colors'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

const weatherLayers = [
  { id: 'temp', label: 'Suhu', url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}` },
  { id: 'clouds', label: 'Awan', url: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}` },
  { id: 'precipitation', label: 'Curah Hujan', url: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}` },
  { id: 'wind', label: 'Angin', url: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${API_KEY}` },
  { id: 'pressure', label: 'Tekanan', url: `https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${API_KEY}` },
]

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => { map.setView(center, 10) }, [center, map])
  return null
}

const markerIcon = L.divIcon({
  html: '<div style="font-size:30px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))">📍</div>',
  iconSize: [30, 30], iconAnchor: [15, 30], className: '',
})

type Props = { weather: WeatherData }

export default function WeatherMap({ weather }: Props) {
  const [activeLayer, setActiveLayer] = useState('temp')
  const [showLayer, setShowLayer] = useState(true)
  const center: [number, number] = [weather.coord.lat, weather.coord.lon]
  const activeUrl = weatherLayers.find((l) => l.id === activeLayer)?.url

  return (
    <section className="fade-in-up" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px', color: c.text }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px' }}>Peta Cuaca</h2>
        <p style={{ fontSize: '15px', opacity: 0.7, margin: 0 }}>Visualisasi cuaca untuk {weather.name}, {weather.sys.country}</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px', justifyContent: 'center' }}>
        {weatherLayers.map((layer) => (
          <button key={layer.id} style={{
            padding: '8px 18px', borderRadius: '50px', border: `1px solid ${c.cardBorder}`,
            background: activeLayer === layer.id ? c.accent : c.chipBg, color: c.text,
            cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s ease',
          }}
            onClick={() => setActiveLayer(layer.id)}
            onMouseEnter={(e) => { if (activeLayer !== layer.id) e.currentTarget.style.background = c.accent }}
            onMouseLeave={(e) => { if (activeLayer !== layer.id) e.currentTarget.style.background = c.chipBg }}
          >
            {layer.label}
          </button>
        ))}
        <button style={{
          padding: '8px 18px', borderRadius: '50px', border: `1px solid ${c.cardBorder}`,
          background: c.chipBg, color: c.text, cursor: 'pointer', fontSize: '13px', fontWeight: 600,
        }}
          onClick={() => setShowLayer(!showLayer)}
        >
          {showLayer ? 'Sembunyikan Layer' : 'Tampilkan Layer'}
        </button>
      </div>

      <div style={{
        borderRadius: '20px', overflow: 'hidden',
        border: `1px solid ${c.cardBorder}`,
        boxShadow: '0 20px 50px -12px rgba(0,0,0,0.3)',
      }}>
        <MapContainer center={center} zoom={10} style={{ height: '450px', width: '100%' }} zoomControl={true}>
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {showLayer && activeUrl && <TileLayer url={activeUrl} opacity={0.5} />}
          <Marker position={center} icon={markerIcon}>
            <Popup>
              <strong>{weather.name}</strong><br />
              {Math.round(weather.main.temp)}°C &middot; {weather.weather[0].description}
            </Popup>
          </Marker>
          <MapUpdater center={center} />
        </MapContainer>
      </div>
    </section>
  )
}
