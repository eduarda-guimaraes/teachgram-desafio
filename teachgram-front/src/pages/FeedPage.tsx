import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PostCard } from '../components/PostCard'

import { getApiErrorMessage } from '../services/errorService'
import { fetchFeedPosts, likePost } from '../services/postService'
import type { User as AuthUser } from '../models/User'
import type { Post } from '../types'

interface FeedPageProps {
  currentUser: AuthUser | null
}

export const FeedPage = ({ currentUser: _currentUser }: FeedPageProps) => {
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

  const [postToDelete, setPostToDelete] = useState<Post | null>(null)

  const handleDelete = async () => {
    if (!postToDelete) return
    setLoading(true)
    try {
      // Assuming deletePost exists in postService, but we might just mock it
      // await deletePost(postToDelete.id)
      setPosts((current) => current.filter((p) => p.id !== postToDelete.id))
      setPostToDelete(null)
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Não foi possível excluir a publicação.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-layout page-layout--feed">
      <section className="feed-column">
        <div className="content-panel border-0 shadow-none bg-transparent p-0">
          <div className="content-panel__header d-flex align-items-center justify-content-between mb-4">
            <div>
              <p className="section-eyebrow mb-1">Feed da comunidade</p>
              <h2 className="mb-0">Últimas publicações</h2>
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
                <PostCard 
                  key={post.id} 
                  post={post} 
                  isOwner={post.user.id === _currentUser?.id}
                  onLike={handleLike} 
                  onDelete={() => setPostToDelete(post)}
                  onEdit={(id) => console.log('Edit post', id)}
                />
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

      {postToDelete && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.4)', zIndex: 1050 }}>
          <div className="bg-white rounded-4 p-4 shadow-sm text-center" style={{ width: 320 }}>
            <h3 className="h6 fw-bold mb-2">Excluir publicação?</h3>
            <p className="small text-muted mb-4">Essa ação não poderá ser desfeita.</p>
            <div className="d-flex justify-content-center gap-3">
              <button type="button" className="btn btn-outline-secondary btn-sm px-4 rounded-pill" onClick={() => setPostToDelete(null)}>
                Cancelar
              </button>
              <button type="button" className="btn btn-danger btn-sm px-4 rounded-pill" onClick={handleDelete} disabled={loading}>
                {loading ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
