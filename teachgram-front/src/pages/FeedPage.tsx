import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PostCard } from '../components/PostCard'
import { highlightCards, teachingTips } from '../data/mock'
import { getApiErrorMessage } from '../services/errorService'
import { fetchFeedPosts, likePost } from '../services/postService'
import type { User as AuthUser } from '../models/User'
import type { Post } from '../types'

interface FeedPageProps {
  currentUser: AuthUser | null
}

export const FeedPage = ({ currentUser }: FeedPageProps) => {
  const [search, setSearch] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    fetchFeedPosts()
      .then((response) => setPosts(response))
      .catch((error) => setErrorMessage(getApiErrorMessage(error, 'Não foi possível carregar o feed.')))
      .finally(() => setLoading(false))
  }, [])

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return posts
    }

    return posts.filter((post) => {
      const author = post.user.name ?? post.user.username ?? ''
      return [post.title, post.description ?? '', author].some((value) =>
        value.toLowerCase().includes(query),
      )
    })
  }, [posts, search])

  const handleLike = async (postId: number) => {
    try {
      const updatedPost = await likePost(postId)
      setPosts((current) => current.map((post) => (post.id === postId ? updatedPost : post)))
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Não foi possível curtir a publicação.'))
    }
  }

  return (
    <div className="page-layout page-layout--feed">
      <section className="feed-column">
        <div className="highlight-grid">
          {highlightCards.map((card) => (
            <article key={card.label} className={`highlight-card highlight-card--${card.tone}`}>
              <span className="section-eyebrow">{card.label}</span>
              <strong>{card.value}</strong>
              <p>{card.description}</p>
            </article>
          ))}
        </div>

        <div className="content-panel">
          <div className="content-panel__header">
            <div>
              <p className="section-eyebrow">Feed da comunidade</p>
              <h2>Últimas publicações</h2>
            </div>
            <label className="inline-search">
              <span aria-hidden="true">⌕</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Filtrar publicações"
              />
            </label>
          </div>

          {errorMessage ? <div className="auth-alert auth-alert--error mb-3">{errorMessage}</div> : null}

          {loading ? (
            <div className="empty-state">
              <h3>Carregando publicações</h3>
              <p>Estamos preparando o feed para você.</p>
            </div>
          ) : (
            <div className="post-list">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} onLike={handleLike} />
              ))}
            </div>
          )}

          {!loading && filteredPosts.length === 0 ? (
            <div className="empty-state">
              <h3>Nenhuma publicação encontrada</h3>
              <p>Tente outro termo ou crie uma nova ideia para compartilhar com a comunidade.</p>
              <Link to="/publicar" className="primary-button">
                Criar publicação
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      {/* Right aside removed to keep feed simple and centered */}
    </div>
  )
}
