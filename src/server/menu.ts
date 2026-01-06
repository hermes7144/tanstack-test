import { getSideMenus } from '@/service/menu.service'
import { createServerFn } from '@tanstack/react-start'

export type MenuNode = {
  label: string
  iconClass?: string
  url?: string
  children?: MenuNode[]
}

export const fetchMenus = createServerFn({ method: 'GET' })
  .handler(async () => {
    return await getSideMenus({
      systemCd: 'QMS',
      userId: 'admin',
      ip: '127.0.0.1',
    })
  })


// export const fetchMenus = createServerFn({ method: 'GET' })
//   .handler(async () => {
//     return [
//       { id: 'dashboard', label: '대시보드' },
//       { id: 'users', label: '사용자 관리' },
//     ]
//   })