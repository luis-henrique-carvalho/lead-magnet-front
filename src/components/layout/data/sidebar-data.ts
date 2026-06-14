import {
  Search,
  History,
  Terminal,
  Command,
  GalleryVerticalEnd,
  AudioWaveform,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Operador',
    email: 'operador@leadmagnet.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Lead Magnet',
      logo: Command,
      plan: 'Product Discovery',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'Lead Magnet',
      items: [
        {
          title: 'Nova Busca',
          url: '/marketplace-searches/new',
          icon: Search,
        },
        {
          title: 'Histórico de Buscas',
          url: '/marketplace-searches',
          icon: History,
        },
      ],
    },
    {
      title: 'Diagnóstico',
      items: [
        {
          title: 'Tarefas de Automação',
          url: '/automation-tasks',
          icon: Terminal,
        },
      ],
    },
  ],
}

