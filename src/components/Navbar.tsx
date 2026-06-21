import { c } from '../colors'

type Props = {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { key: 'home', label: 'Beranda' },
  { key: 'forecast', label: 'Prakiraan' },
  { key: 'map', label: 'Peta' },
]

export default function Navbar({ activeTab, onTabChange }: Props) {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 24px',
      background: c.navBg,
      backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${c.navBorder}`,
      color: c.text,
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
          fontSize: '18px', fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '6px',
        }} onClick={() => onTabChange('home')}>
          🌤️ WeatherApp
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {tabs.map((tab) => (
            <button key={tab.key} style={{
              padding: '6px 14px', borderRadius: '8px', cursor: 'pointer',
              border: 'none', fontSize: '13px', fontWeight: activeTab === tab.key ? 600 : 400,
              background: activeTab === tab.key ? c.accent : 'transparent',
              color: activeTab === tab.key ? c.text : c.textMuted,
              transition: 'all 0.2s ease',
            }}
              onClick={() => onTabChange(tab.key)}
              onMouseEnter={(e) => { if (activeTab !== tab.key) e.currentTarget.style.background = c.accent }}
              onMouseLeave={(e) => { if (activeTab !== tab.key) e.currentTarget.style.background = 'transparent' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
