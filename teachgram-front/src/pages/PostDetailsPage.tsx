import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Modal } from '../components/Modal'
import { deletePost, fetchPostById, likePost } from '../services/postService'
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
    fetchPostById(postId)
      .then(setPost)
      .catch((error) => setErrorMessage(getApiErrorMessage(error, 'Não foi possível abrir a publicação.')))
      .finally(() => setLoading(false))
  }, [id])

  const isOwner = useMemo(() => post?.user.id === currentUser?.id, [post?.user.id, currentUser?.id])

  const handleLike = async () => {
    if (!post) return
    try {
      const updated = await likePost(post.id)
      setPost(updated)
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Não foi possível curtir a publicação.'))
    }
  }

  const handleDelete = async () => {
    if (!post) return
    try {
      await deletePost(post.id)
      navigate('/feed', { replace: true })
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Não foi possível excluir a publicação.'))
      setShowDelete(false)
    }
  }

  if (loading) {
    return <div className="single-page-card"><p>Carregando...</p></div>
  }

  if (!post) {
    return (
      <div className="single-page-card">
        <p>{errorMessage || 'Publicação não encontrada.'}</p>
        <Link to="/feed" className="primary-button">Voltar ao feed</Link>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="d-flex align-items-center p-2 border-bottom">
        <button type="button" className="btn btn-link" onClick={() => navigate(-1)}>← Voltar</button>
      </div>
      {/* Content */}
      <div className="p-3">
        <div className="d-flex align-items-center mb-3">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center text-white small fw-bold"
            style={post.user.profileLink ? {
              width: 36,
              height: 36,
              backgroundImage: `url(${getImageUrl(post.user.profileLink)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: 'transparent',
            } : { width: 36, height: 36, background: '#777' }}
          >
            {!post.user.profileLink && (post.user.name?.split(' ')?.filter(Boolean)?.slice(0, 2)?.map(p => p[0]?.toUpperCase()).join('') || 'T')}
          </div>
          <div className="ms-2">
            <strong>{post.user.name ?? post.user.username ?? 'Teachgram'}</strong>
            <div className="text-muted" style={{ fontSize: '0.85rem' }}>@{post.user.username ?? 'teachgram'}</div>
          </div>
        </div>
        {post.photoLink && (
          <img src={getImageUrl(post.photoLink)} alt={post.title} className="img-fluid rounded-4 mb-3" style={{ maxHeight: '500px', width: '100%', objectFit: 'cover' }} />
        )}
        <div className="mb-2">
          <strong>{post.title}</strong>
          <p className="text-muted mb-0">{post.description}</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <button type="button" className="btn btn-link text-danger p-0" onClick={handleLike}>♥ {post.likesCount}</button>
          {isOwner && (
            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setShowDelete(true)}>Excluir</button>
          )}
        </div>
      </div>
      {/* Delete confirmation modal */}
      <Modal
        open={showDelete}
        title="Excluir publicação?"
        subtitle="Essa ação não poderá ser desfeita"
        onClose={() => setShowDelete(false)}
        size="sm"
        className="teachgram-modal--confirm"
      >
        <div className="teachgram-modal__stack teachgram-modal__stack--center">
          <p className="mb-0 small text-muted">Você realmente deseja apagar esta publicação?</p>
          <div className="teachgram-modal__actions teachgram-modal__actions--center">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowDelete(false)}>Cancelar</button>
            <button type="button" className="btn btn-danger btn-sm" onClick={handleDelete}>Confirmar</button>
          </div>
        </div>
      </Modal>
    </>
  )
}
