/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Modal } from '../components/Modal'
import { deletePost, fetchFeedPosts, fetchPostById, likePost } from '../services/postService'
import { getApiErrorMessage } from '../services/errorService'
import { getImageUrl } from '../utils/ImageUtils'
import type { User as AuthUser } from '../models/User'
import type { Post } from '../types'

interface PostDetailsPageProps {
  currentUser: AuthUser | null
}

export const PostDetailsPage = ({ currentUser }: PostDetailsPageProps) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
  const [relatedItems, setRelatedItems] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    const postId = Number(id)

    if (!postId) {
      setLoading(false)
      setErrorMessage('Publicação não encontrada.')
      return
    }

    Promise.all([fetchPostById(postId), fetchFeedPosts()])
      .then(([responsePost, feed]) => {
        setPost(responsePost)
        setRelatedItems(feed.filter((item) => item.id !== responsePost.id).slice(0, 2))
      })
      .catch((error) => setErrorMessage(getApiErrorMessage(error, 'Nao foi possivel abrir esta publicação.')))
      .finally(() => setLoading(false))
  }, [id])

  const isOwner = useMemo(() => post?.user.id === currentUser?.id, [currentUser?.id, post?.user.id])

  const handleLike = async () => {
    if (!post) {
      return
    }

    try {
      const updated = await likePost(post.id)
      setPost(updated)
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Nao foi possivel curtir a publicação.'))
    }
  }

  const handleDelete = async () => {
    if (!post) {
      return
    }

    try {
      await deletePost(post.id)
      navigate('/feed', { replace: true })
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Não foi possível excluir a publicação.'))
      setShowDelete(false)
    }
  }

  if (loading) {
    return (
      <div className="single-page-card">
        <p className="section-eyebrow">Publicação</p>
        <h1>Carregando detalhes</h1>
        <p>Estamos preparando o conteúdo deste post.</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="single-page-card">
        <p className="section-eyebrow">Publicação não encontrada</p>
        <h1>Não foi possível abrir este post.</h1>
        <p>{errorMessage || 'Talvez ele tenha sido removido ou o link esteja incorreto.'}</p>
        <Link to="/feed" className="primary-button">
          Voltar ao feed
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="page-layout page-layout--detail">
        <section className="content-panel content-panel--wide detail-panel">
          {errorMessage ? <div className="auth-alert auth-alert--error mb-3">{errorMessage}</div> : null}

          <div className="detail-panel__hero">
            <span className={post.isPrivate ? 'post-badge post-badge--private' : 'post-badge'}>
              {post.isPrivate ? 'Privado' : 'Público'}
            </span>
            <h2>{post.title}</h2>
            <p>{post.description}</p>
          </div>

          {post.photoLink ? (
            <img
              src={getImageUrl(post.photoLink)}
              alt={post.title}
              className="img-fluid rounded-4 mb-4"
              style={{ maxHeight: '360px', width: '100%', objectFit: 'cover' }}
            />
          ) : null}

          <div className="detail-meta-grid">
            <article className="detail-meta-card">
              <strong>{post.likesCount}</strong>
              <span>Curtidas</span>
            </article>
            <article className="detail-meta-card">
              <strong>{post.user.name}</strong>
              <span>Autor</span>
            </article>
            <article className="detail-meta-card">
              <strong>{new Date(post.createdAt).toLocaleDateString('pt-BR')}</strong>
              <span>Publicação</span>
            </article>
          </div>

          <div className="content-panel content-panel--nested">
            <div className="content-panel__header">
              <div>
                <p className="section-eyebrow">Interação</p>
                <h2>Conversa da comunidade</h2>
              </div>
            </div>

            <div className="stack-card">
              <p>Essa tela já esta pronta para curtidas e exibição detalhada do post.</p>
              <div className="form-actions">
                <button type="button" className="secondary-button" onClick={handleLike}>
                  Curtir
                </button>
                <Link to={`/perfil/${post.user.id}`} className="primary-button">
                  Ver perfil
                </Link>
              </div>
            </div>
          </div>
        </section>

        <aside className="page-aside">
          <section className="content-panel content-panel--aside">
            <div className="content-panel__header">
              <div>
                <p className="section-eyebrow">Relacionados</p>
                <h2>Outras ideias parecidas</h2>
              </div>
            </div>

            <div className="related-list">
              {relatedItems.map((item) => (
                <article key={item.id} className="related-item">
                  <span className="related-item__index">{String(item.id).padStart(2, '0')}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="content-panel content-panel--aside">
            <div className="content-panel__header">
              <div>
                <p className="section-eyebrow">Ação rápida</p>
                <h2>Compartilhe o post</h2>
              </div>
            </div>

            <div className="stack-card">
              <p>Convide amigos para verem essa ideia e ampliarem a conversa.</p>
              <button type="button" className="secondary-button secondary-button--full" onClick={handleLike}>
                Curtir agora
              </button>
              {isOwner ? (
                <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setShowDelete(true)}>
                  Excluir publicação
                </button>
              ) : null}
            </div>
          </section>
        </aside>
      </div>

      <Modal
        open={showDelete}
        title="Excluir publicação ?"
        subtitle="Essa acao nao podera ser desfeita"
        onClose={() => setShowDelete(false)}
        size="sm"
        className="teachgram-modal--confirm"
      >
        <div className="teachgram-modal__stack teachgram-modal__stack--center">
          <p className="mb-0 small text-muted">Voce realmente deseja apagar esta publicação?</p>
          <div className="teachgram-modal__actions teachgram-modal__actions--center">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowDelete(false)}>
              Cancelar
            </button>
            <button type="button" className="btn btn-danger btn-sm" onClick={handleDelete}>
              Confirmar
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
