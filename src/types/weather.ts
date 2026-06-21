export type WeatherData = {
  coord: { lat: number; lon: number }
  name: string
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
    temp_min: number
    temp_max: number
  }
  weather: { description: string; icon: string; main: string }[]
  wind: { speed: number; deg: number }
  sys: { country: string; sunrise: number; sunset: number }
  visibility: number
  timezone: number
}

export type ForecastDay = {
  date: string
  dayName: string
  temp: number
  tempMin: number
  tempMax: number
  icon: string
  description: string
  humidity: number
  wind: number
}

export type FeaturedCity = {
  name: string
  country: string
}
