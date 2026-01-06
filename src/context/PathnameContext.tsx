import { createContext, useContext } from 'react'

const PathnameContext = createContext<string | null>(null)

export function PathnameProvider({
  pathname,
  children,
}: {
  pathname: string
  children: React.ReactNode
}) {
  return (
    <PathnameContext.Provider value={pathname}>
      {children}
    </PathnameContext.Provider>
  )
}

export function usePathnameContext() {
  const ctx = useContext(PathnameContext)
  if (!ctx) {
    throw new Error('usePathnameContext must be used within PathnameProvider')
  }
  return ctx
}
