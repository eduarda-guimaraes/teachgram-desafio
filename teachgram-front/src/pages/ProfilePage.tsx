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
    <div className="page-layout page-layout--profile">
      <div className="content-panel content-panel--wide">
        {errorMessage ? <div className="auth-alert auth-alert--error mb-4">{errorMessage}</div> : null}

        <div className="profile-hero">
          <div className="profile-hero__banner" />
          <div className="profile-hero__content d-flex flex-column align-items-center text-center">
            <div
              className="profile-hero__avatar"
              style={
                profile?.profileLink
                  ? {
                      backgroundImage: `url(${profile?.profileLink})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      color: 'transparent',
                    }
                  : undefined
              }
            >
              {initials}
            </div>

            <div className="profile-hero__main d-flex flex-column align-items-center gap-2">
              <div className="d-flex align-items-center gap-2">
                <h2 className="mb-0">{profile?.name ?? 'Perfil'}</h2>
                {isOwnProfile ? (
                  <Link to="/configuracoes" className="btn btn-link p-0 text-muted" aria-label="Configurações do perfil">
                    ⚙
                  </Link>
                ) : (
                  <button className="btn btn-link p-0 text-muted">⚙</button>
                )}
              </div>
              <p className="mb-0 text-muted small">@{profile?.username ?? 'teachgram'}</p>
              
              {!isOwnProfile && (
                <button className="btn btn-outline-secondary btn-sm rounded-pill mt-1 px-3 d-flex align-items-center gap-2" style={{ fontSize: '0.75rem' }}>
                  Amigo <span style={{ fontSize: '0.6rem' }}>▼</span>
                </button>
              )}

              <p className="profile-hero__bio mt-2 text-muted">
                {profile?.bio ?? 'Sem biografia cadastrada no momento.'}
              </p>
            </div>

            <div className="profile-stats-grid d-flex gap-4 mt-3">
              <article className="profile-stat-card d-flex flex-column align-items-center bg-transparent p-0">
                <strong>{posts.length}</strong>
                <span>Posts</span>
              </article>
              <article className="profile-stat-card d-flex flex-column align-items-center bg-transparent p-0">
                <strong>{profile?.friendsCount ?? 0}</strong>
                <span>Amigos</span>
              </article>
            </div>
          </div>
        </div>

        <div className="profile-page__grid mt-4 mx-auto" style={{ maxWidth: '600px' }}>
          {loading ? (
            <div className="empty-state w-100 grid-column-span-3">
              <h3>Carregando perfil</h3>
              <p>Estamos buscando os dados e publicações dessa conta.</p>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} compact />)
          ) : (
            <div className="empty-state w-100 grid-column-span-3">
              <h3>Nenhuma publicação por aqui</h3>
              <p>Esse perfil ainda não publicou nada visível para você.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
