// src/stores/tab.store.ts
import { create } from 'zustand'
import React from 'react'

export type Tab = {
  id: string
  title: string
  pathname: string
  Component: React.FC
}

type TabState = {
  tabs: Tab[]
  activeTabId: string | null
  openTab: (tab: Tab) => void
  closeTab: (id: string) => void
  setActive: (id: string) => void
}

export const useTabStore = create<TabState>((set) => ({
  tabs: [],
  activeTabId: null,

  openTab: (tab) =>
    set((state) => {
      const exists = state.tabs.find((t) => t.id === tab.id)
      if (exists) {
        return { activeTabId: tab.id }
      }
      return {
        tabs: [...state.tabs, tab],
        activeTabId: tab.id,
      }
    }),

  closeTab: (id) =>
    set((state) => {
      const tabs = state.tabs.filter((t) => t.id !== id)
      return {
        tabs,
        activeTabId: tabs.at(-1)?.id ?? null,
      }
    }),

  setActive: (id) => set({ activeTabId: id }),
}))
