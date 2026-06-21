import type { ForecastDay } from '../types/weather'

export function getWeatherGradient(weatherMain: string, isNight: boolean): string {
  if (isNight) return 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
  const map: Record<string, string> = {
    Clear: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    Clouds: 'linear-gradient(135deg, #89ABE3 0%, #6C7B8A 100%)',
    Rain: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    Drizzle: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    Thunderstorm: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    Snow: 'linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%)',
    Mist: 'linear-gradient(135deg, #B6BCC9 0%, #8E95A5 100%)',
    Fog: 'linear-gradient(135deg, #B6BCC9 0%, #8E95A5 100%)',
    Haze: 'linear-gradient(135deg, #B6BCC9 0%, #8E95A5 100%)',
  }
  return map[weatherMain] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
}

export function isNightTime(sunrise: number, sunset: number, timezone: number): boolean {
  const now = Math.floor(Date.now() / 1000) + timezone
  return now < sunrise || now > sunset
}

export function getWindLabel(speed: number): string {
  if (speed < 0.3) return 'Tenang'
  if (speed < 1.5) return 'Sepoi-sepoi'
  if (speed < 3.3) return 'Ringan'
  if (speed < 5.5) return 'Sedang'
  if (speed < 7.9) return 'Kencang'
  return 'Sangat kencang'
}

export function formatTime(unix: number, tz: number): string {
  const d = new Date((unix + tz) * 1000)
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
}

export function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 10) return 'Selamat Pagi'
  if (h < 15) return 'Selamat Siang'
  if (h < 18) return 'Selamat Sore'
  return 'Selamat Malam'
}

type ForecastItem = {
  dt_txt: string
  main: { temp: number; temp_min: number; temp_max: number; humidity: number }
  weather: { description: string; icon: string }[]
  wind: { speed: number }
}

export function processForecast(list: ForecastItem[]): ForecastDay[] {
  const grouped: Record<string, ForecastItem[]> = {}

  for (const item of list) {
    const date = item.dt_txt.split(' ')[0]
    if (!grouped[date]) grouped[date] = []
    grouped[date].push(item)
  }

  const result: ForecastDay[] = []

  for (const [date, items] of Object.entries(grouped)) {
    const midday = items.find((i) => i.dt_txt.includes('12:00')) || items[Math.floor(items.length / 2)]
    const tempMin = Math.min(...items.map((i) => i.main.temp_min))
    const tempMax = Math.max(...items.map((i) => i.main.temp_max))

    result.push({
      date,
      dayName: '',
      temp: midday.main.temp,
      tempMin,
      tempMax,
      icon: midday.weather[0].icon,
      description: midday.weather[0].description,
      humidity: Math.round(items.reduce((s, i) => s + i.main.humidity, 0) / items.length),
      wind: Math.round(items.reduce((s, i) => s + i.wind.speed, 0) / items.length * 10) / 10,
    })
  }

  return result.slice(0, 5)
}
