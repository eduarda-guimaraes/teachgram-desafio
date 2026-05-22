import { Link } from 'react-router-dom'
import type { User as AuthUser } from '../models/User'

interface ProfilePageProps {
  currentUser: AuthUser | null
}

const photoTiles = [
  'profile-tile--one',
  'profile-tile--two',
  'profile-tile--three',
  'profile-tile--four',
  'profile-tile--five',
  'profile-tile--six',
]

const profileStats = [
  { label: 'Posts', value: '50' },
  { label: 'Amigos', value: '100' },
]

export const ProfilePage = ({ currentUser }: ProfilePageProps) => {
  const initials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('')
    : 'M'

  return (
    <div className="profile-page container-fluid p-3 p-lg-4">
      <div className="row g-4">
        <section className="col-12 col-xl-9">
          <div className="profile-page__hero d-flex flex-column flex-md-row align-items-start gap-4">
            <div className="profile-page__avatar shadow-sm">{initials}</div>

            <div className="profile-page__intro flex-grow-1">
              <div className="profile-page__name-row d-flex justify-content-between align-items-start gap-3">
                <div>
                  <h1 className="h5 fw-bold mb-1">{currentUser?.name ?? 'Maria'}</h1>
                  <p className="text-muted small mb-0">Fotógrafa</p>
                </div>
                <button type="button" className="profile-page__options btn btn-link p-0" aria-label="Configurações do perfil">
                  ⚙
                </button>
              </div>
              <p className="profile-page__bio text-muted small mt-3 mb-0">O melhor de mim ainda está por vir. 🌹</p>
            </div>
          </div>

          <div className="profile-page__stats d-flex flex-wrap gap-4 gap-md-5 mt-4 ms-md-5 ps-md-5">
            {profileStats.map((stat) => (
              <article key={stat.label} className="text-center">
                <strong className="d-block h6 mb-1">{stat.value}</strong>
                <span className="small text-muted">{stat.label}</span>
              </article>
            ))}
          </div>

          <div className="profile-page__grid row row-cols-2 row-cols-md-3 g-0 mt-4 ms-md-4">
            {photoTiles.map((tile, index) => (
              <div key={tile} className="col">
                <article className={`profile-tile ratio ratio-1x1 ${tile}`}>
                  <span className="profile-tile__number">{String(index + 1).padStart(2, '0')}</span>
                </article>
              </div>
            ))}
          </div>
        </section>

        <aside className="col-12 col-xl-3">
          <section className="profile-side-card card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body d-grid gap-2">
              <p className="section-eyebrow mb-1">Atalhos</p>
              <Link to="/amigos" className="profile-side-card__link btn btn-outline-primary btn-sm">
                Ver amigos
              </Link>
              <Link to="/configuracoes" className="profile-side-card__link btn btn-outline-primary btn-sm">
                Ajustar conta
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
