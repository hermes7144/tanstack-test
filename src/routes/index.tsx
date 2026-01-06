import { SideMenu } from '@/components/SideMenu';
import { Tabs } from '@/components/Tabs';
import { fetchMenus } from '@/server/menu';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {

  const { data } = useQuery({
      queryKey: ['menus'],
      queryFn: fetchMenus,
    })
    

   return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <SideMenu menus={data} />
      <Tabs />
    </div>
  )
}
