// src/components/SideMenu.tsx
import { loadPageByUrl } from '@/config/pageLoader'
import { MenuNode } from '@/server/menu'
import { useTabStore } from '@/stores/tab.store'

export function SideMenu({ menus }: { menus: MenuNode[] }) {  
  if (!menus) return <></>;
  return (
    <aside style={{ width: 260 }}>
      {menus.map((menu) => (
        <MenuLevel1 key={menu.label} node={menu} />
      ))}
    </aside>
  )
}

function MenuLevel1({ node }: { node: MenuNode }) {
  return (
    <div>
      <div style={{ fontWeight: 'bold' }}>{node.label}</div>
      {node.children?.map((child) => (
        <MenuLevel2 key={child.label} node={child} />
      ))}
    </div>
  )
}

function MenuLevel2({ node }: { node: MenuNode }) {
  return (
    <div style={{ paddingLeft: 12 }}>
      <div>{node.label}</div>
      {node.children?.map((child) => (
        <MenuLevel3 key={child.label} node={child} />
      ))}
    </div>
  )
}

function MenuLevel3({ node }: { node: MenuNode }) {
  const openTab = useTabStore((s) => s.openTab)

  return (
    <div
      style={{ paddingLeft: 24, cursor: 'pointer' }}
      onClick={() => {
        if (!node.url) return

        const Component = loadPageByUrl(node.url)
        if (!Component) return

        openTab({
          id: node.url,
          title: node.label,
          pathname: node.url.split('?')[0],
          Component,
        })
      }}
    >
      {node.label}
    </div>
  )
}