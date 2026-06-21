import { c } from '../colors'

export default function Footer() {
  return (
    <footer style={{
      textAlign: 'center', padding: '24px', fontSize: '13px',
      opacity: 0.5, borderTop: `1px solid ${c.sunBorder}`, color: c.text,
    }}>
      WeatherApp &copy; {new Date().getFullYear()} &mdash; Dibuat dengan ❤️
    </footer>
  )
}
