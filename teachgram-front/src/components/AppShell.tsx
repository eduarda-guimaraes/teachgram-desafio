import { Link, NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { User as AuthUser } from '../models/User'
import logoImg from '../assets/logo.png'

interface AppShellProps {
  currentUser: AuthUser | null
  onLogout: () => void
  children: ReactNode
}

const navigationItems = [
  { to: '/feed', label: 'Feed', icon: '⌂' },
  { to: '/amigos', label: 'Amigos', icon: '◫' },
  { to: '/perfil', label: 'Perfil', icon: '◉' },
  { to: '/configuracoes', label: 'Configurações', icon: '⚙' },
  { to: '/publicar', label: 'Criar', icon: '+' },
]

export const AppShell = ({ currentUser, onLogout, children }: AppShellProps) => {
  return (
    <div className="app-shell app-shell--figma">
      <aside className="app-sidebar">
        <div className="app-sidebar__brand">
          <Link to="/feed" className="app-brand__link">
            <span className="app-back-link" aria-hidden="true">
              ←
            </span>
            <img className="app-brand__logo" src={logoImg} alt="Teachgram" />
          </Link>
        </div>

        <nav className="app-nav" aria-label="Navegação principal">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'app-nav__item is-active' : 'app-nav__item')}
            >
              <span className="app-nav__icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <p className="app-user-label">@{currentUser?.username ?? 'teachgram'}</p>

        <button type="button" className="app-logout-button" onClick={onLogout}>
          Sair
        </button>
      </aside>

      <main className="app-content">
        <section className="app-board">{children}</section>
      </main>
    </div>
  )
}
