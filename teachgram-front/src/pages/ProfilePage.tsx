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
    <div className="page-layout page-layout--profile">
      <section className="profile-page">
        <div className="profile-page__hero">
          <div className="profile-page__avatar">{initials}</div>

          <div className="profile-page__intro">
            <div className="profile-page__name-row">
              <div>
                <h1>{currentUser?.name ?? 'Maria'}</h1>
                <p>Fotógrafa</p>
              </div>
              <button type="button" className="profile-page__options" aria-label="Configurações do perfil">
                ⚙
              </button>
            </div>
            <p className="profile-page__bio">
              O melhor de mim ainda está por vir. 🌹
            </p>
          </div>
        </div>

        <div className="profile-page__stats">
          {profileStats.map((stat) => (
            <article key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </article>
          ))}
        </div>

        <div className="profile-page__grid">
          {photoTiles.map((tile, index) => (
            <article key={tile} className={`profile-tile ${tile}`}>
              <span className="profile-tile__number">0{index + 1}</span>
            </article>
          ))}
        </div>
      </section>

      <aside className="page-aside">
        <section className="profile-side-card">
          <p className="section-eyebrow">Atalhos</p>
          <Link to="/amigos" className="profile-side-card__link">
            Ver amigos
          </Link>
          <Link to="/configuracoes" className="profile-side-card__link">
            Ajustar conta
          </Link>
        </section>
      </aside>
    </div>
  )
}
