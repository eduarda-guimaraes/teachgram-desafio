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
    <div className="app-shell app-shell--bootstrap container-fluid py-3 py-lg-4">
      <div className="row g-3 align-items-start">
        <aside className="col-12 col-lg-3 col-xxl-2">
          <div className="app-sidebar card border-0 shadow-sm rounded-4 h-100 sticky-top">
            <div className="card-body d-flex flex-column gap-3">
              <div className="app-sidebar__brand">
                <Link to="/feed" className="app-brand__link d-flex align-items-center gap-2 text-decoration-none">
                  <span className="app-back-link" aria-hidden="true">
                    ←
                  </span>
                  <img className="app-brand__logo img-fluid" src={logoImg} alt="Teachgram" />
                </Link>
              </div>

              <nav className="app-nav nav nav-pills flex-column gap-2" aria-label="Navegação principal">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        'app-nav__item',
                        'nav-link',
                        'd-flex',
                        'align-items-center',
                        'gap-2',
                        'text-start',
                        isActive ? 'is-active active' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')
                    }
                  >
                    <span className="app-nav__icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="mt-auto d-grid gap-2">
                <div className="app-user-label small text-muted">@{currentUser?.username ?? 'teachgram'}</div>
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onLogout}>
                  Sair
                </button>
              </div>
            </div>
          </div>
        </aside>

        <main className="col-12 col-lg-9 col-xxl-10">
          <section className="app-board card border-0 shadow-sm rounded-4 h-100">{children}</section>
        </main>
      </div>
    </div>
  )
}
