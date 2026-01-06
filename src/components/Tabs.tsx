// src/components/Tabs.tsx
import { PathnameProvider } from '@/context/PathnameContext';
import { useTabStore } from '@/stores/tab.store'
import { Suspense } from 'react'

export function Tabs() {
  const { tabs, activeTabId, setActive, closeTab } = useTabStore()

  return (
    <section style={{ flex: 1, padding: 12 }}>
      {/* 탭 바 */}
      <div style={{ display: 'flex', gap: 8 }}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActive(tab.id)}
            style={{
              padding: '6px 10px',
              border: '1px solid #ccc',
              background: tab.id === activeTabId ? '#eee' : '#fff',
              cursor: 'pointer',
            }}
          >
            {tab.title}
            <span
              onClick={(e) => {
                e.stopPropagation()
                closeTab(tab.id)
              }}
              style={{ marginLeft: 6, color: 'red' }}
            >
              ×
            </span>
          </div>
        ))}
      </div>

      {/* 페이지 영역 */}
  <div style={{ marginTop: 16, flex: 1, overflow: 'auto' }}>
    {tabs.map((tab) => (
      <div key={tab.id} style={{ display: tab.id === activeTabId ? 'block' : 'none' }}>
        <PathnameProvider pathname={tab.pathname}>
          <Suspense fallback={null}>
            <tab.Component />
          </Suspense>
        </PathnameProvider>
      </div>
    ))}
  </div>
    </section>
  )
}
