import { useState, useEffect, useRef } from 'react'
import type { WeatherData, ForecastDay } from './types/weather'
import type { Suggestion } from './components/SearchCard'
import { getWeatherGradient, isNightTime, processForecast } from './utils/weather'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SearchCard from './components/SearchCard'
import Forecast from './components/Forecast'
import FeaturedCities from './components/FeaturedCities'
import TipsSection from './components/TipsSection'
import WeatherMap from './components/WeatherMap'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct'

export default function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastDay[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [bgGradient, setBgGradient] = useState('linear-gradient(135deg, #667eea 0%, #764ba2 100%)')
  const [activeTab, setActiveTab] = useState('home')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      .fade-in-up { animation: fadeInUp 0.6s ease forwards; }
      .fade-in { animation: fadeIn 0.5s ease forwards; }
      * { box-sizing: border-box; }
      body { margin: 0; }
    `
    document.head.appendChild(style)
    return () => { document.head.removeChild(style) }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    const trimmed = city.trim()
    if (trimmed.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${GEO_URL}?q=${trimmed}&limit=5&appid=${API_KEY}`)
        if (!res.ok) return
        const data: { name: string; country: string; state?: string }[] = await res.json()
        const sorted = [...data].sort((a, b) => {
          if (a.country === 'ID' && b.country !== 'ID') return -1
          if (a.country !== 'ID' && b.country === 'ID') return 1
          return 0
        })
        setSuggestions(sorted)
        setShowSuggestions(true)
        setSelectedIndex(-1)
      } catch {
        /* ignore */
      }
    }, 300)

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [city])

  function getBg(): string {
    if (weather) {
      return getWeatherGradient(weather.weather[0].main, isNightTime(weather.sys.sunrise, weather.sys.sunset, weather.timezone))
    }
    return bgGradient
  }

  async function fetchWeather(q: string) {
    setLoading(true)
    setError('')
    setWeather(null)
    setForecast([])
    try {
      const res = await fetch(`${WEATHER_URL}?q=${q}&appid=${API_KEY}&units=metric`)
      if (!res.ok) throw new Error(res.status === 404 ? 'Kota tidak ditemukan' : 'Gagal mengambil data')
      const data: WeatherData = await res.json()
      setWeather(data)
      setBgGradient(getWeatherGradient(data.weather[0].main, isNightTime(data.sys.sunrise, data.sys.sunset, data.timezone)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  async function fetchForecast(q: string) {
    setLoading(true)
    setError('')
    setForecast([])
    try {
      const res = await fetch(`${FORECAST_URL}?q=${q}&appid=${API_KEY}&units=metric`)
      if (!res.ok) throw new Error('Gagal mengambil prakiraan')
      const data = await res.json()
      setForecast(processForecast(data.list))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(q: string) {
    setCity(q)
    fetchWeather(q)
    if (activeTab === 'forecast') fetchForecast(q)
    setActiveTab('home')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setShowSuggestions(false)
    setSuggestions([])
    if (city.trim()) handleSearch(city.trim())
  }

  function handleCitySelect(name: string) {
    setCity(name)
    fetchWeather(name)
    setActiveTab('home')
  }

  function handleSuggestionSelect(s: Suggestion) {
    setShowSuggestions(false)
    setSuggestions([])
    const q = s.state ? `${s.name},${s.state},${s.country}` : `${s.name},${s.country}`
    setCity(s.name)
    fetchWeather(q)
    if (activeTab === 'forecast') fetchForecast(q)
    setActiveTab('home')
  }

  function handleInputKeyDown(e: React.KeyboardEvent) {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : 0)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => prev > 0 ? prev - 1 : suggestions.length - 1)
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSuggestionSelect(suggestions[selectedIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }
  }

  function handleInputBlur() {
    setTimeout(() => setShowSuggestions(false), 200)
  }

  function handleTabChange(tab: string) {
    setActiveTab(tab)
    if (tab === 'forecast' && city.trim()) fetchForecast(city.trim())
    if (tab === 'map' && city.trim() && !weather) fetchWeather(city.trim())
  }

  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      background: getBg(),
      transition: 'background 0.8s ease',
    }}>
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      {activeTab === 'home' && (
        <>
          <section style={{
            minHeight: weather ? 'auto' : 'calc(100vh - 72px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: weather ? '60px 24px 40px' : '0 24px',
            flexDirection: 'column',
          }}>
            {!weather && !loading && <Hero />}
            <SearchCard city={city} onCityChange={setCity} onSubmit={handleSubmit}
              loading={loading} error={error} weather={weather}
              suggestions={suggestions} showSuggestions={showSuggestions}
              selectedIndex={selectedIndex} onSuggestionSelect={handleSuggestionSelect}
              onInputKeyDown={handleInputKeyDown} onInputBlur={handleInputBlur} />
          </section>
          <FeaturedCities onSelect={handleCitySelect} />
          <TipsSection />
        </>
      )}

      {activeTab === 'forecast' && (
        <section style={{ minHeight: 'calc(100vh - 72px)', padding: '40px 24px' }}>
          <div style={{ maxWidth: '520px', margin: '0 auto' }}>
            <SearchCard city={city} onCityChange={setCity}
              onSubmit={(e) => { e.preventDefault(); if (city.trim()) { setCity(city.trim()); fetchForecast(city.trim()) } }}
              loading={loading} error={error} weather={null}
              suggestions={suggestions} showSuggestions={showSuggestions}
              selectedIndex={selectedIndex} onSuggestionSelect={handleSuggestionSelect}
              onInputKeyDown={handleInputKeyDown} onInputBlur={handleInputBlur} />
          </div>
          {forecast.length > 0 && !loading && <Forecast forecast={forecast} />}
          {!city.trim() && !loading && (
            <p style={{ color: 'white', opacity: 0.6, textAlign: 'center', marginTop: '24px', fontSize: '15px' }}>
              Masukkan nama kota untuk melihat prakiraan cuaca
            </p>
          )}
        </section>
      )}

      {activeTab === 'map' && (
        <section style={{ minHeight: 'calc(100vh - 72px)', padding: '40px 24px' }}>
          <div style={{ maxWidth: '520px', margin: '0 auto' }}>
            <SearchCard city={city} onCityChange={setCity}
              onSubmit={(e) => { e.preventDefault(); if (city.trim()) { setCity(city.trim()); fetchWeather(city.trim()) } }}
              loading={loading} error={error} weather={null}
              suggestions={suggestions} showSuggestions={showSuggestions}
              selectedIndex={selectedIndex} onSuggestionSelect={handleSuggestionSelect}
              onInputKeyDown={handleInputKeyDown} onInputBlur={handleInputBlur} />
          </div>
          {weather && !loading && <WeatherMap weather={weather} />}
          {!weather && !loading && (
            <div style={{ textAlign: 'center', marginTop: '60px', color: 'white' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px' }}>Peta Cuaca</h2>
              <p style={{ opacity: 0.6, margin: 0 }}>Masukkan nama kota untuk melihat peta cuaca interaktif</p>
            </div>
          )}
        </section>
      )}

    </div>
  )
}
