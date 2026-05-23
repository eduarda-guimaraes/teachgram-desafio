import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getApiErrorMessage } from '../services/errorService'
import { fetchPostsByUser } from '../services/postService'
import { fetchUserById } from '../services/userService'
import { getImageUrl } from '../utils/ImageUtils'
import type { User as AuthUser } from '../models/User'
import type { Post, User } from '../types'

interface ProfilePageProps {
  currentUser: AuthUser | null
}

const getAccent = (id: number) => {
  const palettes = [
    'linear-gradient(135deg, #ff8b72, #ffcf9a)',
    'linear-gradient(135deg, #f86f8f, #ffb3c7)',
    'linear-gradient(135deg, #ffb24d, #ffdca4)',
    'linear-gradient(135deg, #7fb4ff, #cce0ff)',
  ]
  return palettes[(id - 1) % palettes.length]
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
    <div className="page-layout page-layout--profile d-flex flex-column align-items-center pt-5">
      <div className="content-panel content-panel--wide d-flex flex-column align-items-center">
        {errorMessage ? <div className="auth-alert auth-alert--error mb-4">{errorMessage}</div> : null}

        <div className="profile-header w-100">
          <div
            className="profile-avatar shadow-sm"
            style={
              profile?.profileLink
                ? {
                    backgroundImage: `url(${getImageUrl(profile?.profileLink)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: 'transparent',
                  }
                : undefined
            }
          >
            {initials}
          </div>

          <div className="profile-info">
            <h2 className="mb-2">{profile?.name ?? 'Perfil'}</h2>
            <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
              {profile?.bio ?? 'Fotógrafa\nO melhor de mim ainda está por vir. 🌹'}
            </p>
            <p className="text-muted small mb-3">@{profile?.username ?? 'teachgram'}</p>

            <div className="d-flex align-items-center gap-2">
              {!isOwnProfile && (
                <button className="btn btn-outline-secondary btn-sm rounded-pill px-3 d-flex align-items-center gap-2" style={{ fontSize: '0.75rem' }}>
                  Amigo <span style={{ fontSize: '0.6rem' }}>▼</span>
                </button>
              )}
              {isOwnProfile && (
                <Link to="/configuracoes" className="btn btn-outline-secondary btn-sm rounded-pill px-3 text-decoration-none">
                  Configurações
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="profile-stats-grid">
          <article>
            <strong>{posts.length}</strong>
            <span>Posts</span>
          </article>
          <div className="vr" style={{ opacity: 0.15 }}></div>
          <article>
            <strong>{profile?.friendsCount ?? 0}</strong>
            <span>Amigos</span>
          </article>
        </div>

        <div className="profile-posts-grid">
          {loading ? (
            <div className="empty-state" style={{ gridColumn: 'span 3' }}>
              <h3>Carregando perfil</h3>
              <p>Estamos buscando os dados e publicações dessa conta.</p>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <Link to={`/post/${post.id}`} key={post.id} className="profile-post-item">
                {post.photoLink ? (
                  <img src={getImageUrl(post.photoLink)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div
                    className="post-placeholder d-flex align-items-center justify-content-center text-white font-weight-bold"
                    style={{ background: getAccent(post.id), padding: '20px', textAlign: 'center' }}
                  >
                    {post.title}
                  </div>
                )}
              </Link>
            ))
          ) : (
            <div className="empty-state" style={{ gridColumn: 'span 3' }}>
              <h3>Nenhuma publicação por aqui</h3>
              <p>Esse perfil ainda não publicou nada visível para você.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
