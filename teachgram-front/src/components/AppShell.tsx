import { Link, NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { User as AuthUser } from '../models/User'

import { IconHome, IconPeople, IconUser, IconSettings, IconPlusSquare } from './Icons';
import Logo from './Logo';

interface AppShellProps {
  currentUser: AuthUser | null
  onLogout: () => void
  children: ReactNode
}

const navigationItems = [
  { to: '/feed', label: 'Feed', icon: <IconHome size={20} /> },
  { to: '/amigos', label: 'Amigos', icon: <IconPeople size={20} /> },
  { to: '/perfil', label: 'Perfil', icon: <IconUser size={20} /> },
  { to: '/configuracoes', label: 'Configurações', icon: <IconSettings size={20} /> },
  { to: '/publicar', label: 'Criar', icon: <IconPlusSquare size={20} /> },
]

export const AppShell = ({ currentUser: _currentUser, onLogout, children }: AppShellProps) => {
  return (
    <div className="app-shell app-shell--figma">
      <aside className="app-sidebar">
        <div className="app-sidebar__inner">
          <div className="app-sidebar__brand">
            <Link to="/feed" className="app-brand__link text-decoration-none d-flex align-items-center gap-2">
              <Logo className="app-brand__logo" />
              <span className="app-brand__name">Teachgram</span>
            </Link>
          </div>

          <nav className="app-nav" aria-label="Navegação principal">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  ['app-nav__item', isActive ? 'is-active' : ''].filter(Boolean).join(' ')
                }
              >
                <span className="app-nav__icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="app-nav__label">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <button type="button" className="app-logout-button" onClick={onLogout}>
            Sair
          </button>
        </div>
      </aside>

      <main className="app-content">
        <div className="app-board">{children}</div>
      </main>
    </div>
  )
}
