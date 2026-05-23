import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PostCard } from '../components/PostCard'
import { getApiErrorMessage } from '../services/errorService'
import { fetchPostsByUser } from '../services/postService'
import { fetchUserById } from '../services/userService'
import type { User as AuthUser } from '../models/User'
import type { Post, User } from '../types'

interface ProfilePageProps {
  currentUser: AuthUser | null
}

export const ProfilePage = ({ currentUser }: ProfilePageProps) => {
  const { id } = useParams()
  const isOwnProfile = !id || Number(id) === currentUser?.id
  const [profile, setProfile] = useState<User | null>(isOwnProfile ? currentUser : null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const targetUserId = id ? Number(id) : currentUser?.id

    if (!targetUserId) {
      setLoading(false)
      return
    }

    Promise.all([
      isOwnProfile && currentUser ? Promise.resolve(currentUser) : fetchUserById(targetUserId),
      fetchPostsByUser(targetUserId),
    ])
      .then(([user, profilePosts]) => {
        setProfile(user)
        setPosts(profilePosts)
      })
      .catch((error) => setErrorMessage(getApiErrorMessage(error, 'Não foi possível carregar este perfil.')))
      .finally(() => setLoading(false))
  }, [currentUser, id, isOwnProfile])

  const initials = useMemo(() => {
    const name = profile?.name ?? 'Teachgram'
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('')
  }, [profile])

  return (
    <div className="profile-page container-fluid p-3 p-lg-4">
      {errorMessage ? <div className="auth-alert auth-alert--error mb-4">{errorMessage}</div> : null}

      <div className="row g-4">
        <section className="col-12 col-xl-9">
          <div className="profile-page__hero d-flex flex-column flex-md-row align-items-start gap-4">
            <div
              className="profile-page__avatar shadow-sm"
              style={
                profile?.profileLink
                  ? {
                      backgroundImage: `url(${profile.profileLink})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      color: 'transparent',
                    }
                  : undefined
              }
            >
              {initials}
            </div>

            <div className="profile-page__intro flex-grow-1">
              <div className="profile-page__name-row d-flex justify-content-between align-items-start gap-3">
                <div>
                  <h1 className="h5 fw-bold mb-1">{profile?.name ?? 'Perfil'}</h1>
                  <p className="text-muted small mb-0">@{profile?.username ?? 'teachgram'}</p>
                </div>
                {isOwnProfile ? (
                  <Link to="/configuracoes" className="profile-page__options btn btn-link p-0" aria-label="Configurações do perfil">
                    ⚙
                  </Link>
                ) : null}
              </div>
              <p className="profile-page__bio text-muted small mt-3 mb-0">
                {profile?.bio ?? 'Sem biografia cadastrada no momento.'}
              </p>
            </div>
          </div>

          <div className="profile-page__stats d-flex flex-wrap gap-4 gap-md-5 mt-4 ms-md-5 ps-md-5">
            <article className="text-center">
              <strong className="d-block h6 mb-1">{posts.length}</strong>
              <span className="small text-muted">Posts</span>
            </article>
            <article className="text-center">
              <strong className="d-block h6 mb-1">{profile?.friendsCount ?? 0}</strong>
              <span className="small text-muted">Amigos</span>
            </article>
          </div>

          <div className="post-list mt-4">
            {loading ? (
              <div className="empty-state">
                <h3>Carregando perfil</h3>
                <p>Estamos buscando os dados e publicações dessa conta.</p>
              </div>
            ) : posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} compact />)
            ) : (
              <div className="empty-state">
                <h3>Nenhuma publicação por aqui</h3>
                <p>Esse perfil ainda não publicou nada visível para você.</p>
              </div>
            )}
          </div>
        </section>

        <aside className="col-12 col-xl-3">
          <section className="profile-side-card card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body d-grid gap-2">
              <p className="section-eyebrow mb-1">Atalhos</p>
              <Link to="/amigos" className="profile-side-card__link btn btn-outline-primary btn-sm">
                Ver amigos
              </Link>
              {isOwnProfile ? (
                <Link to="/configuracoes" className="profile-side-card__link btn btn-outline-primary btn-sm">
                  Ajustar conta
                </Link>
              ) : null}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
