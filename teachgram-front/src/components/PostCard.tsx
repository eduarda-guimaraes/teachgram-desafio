import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Post } from '../types'

interface PostCardProps {
  post: Post
  compact?: boolean
  isOwner?: boolean
  onEdit?: (postId: number) => void
  onDelete?: (postId: number) => void
  onLike?: (postId: number) => void
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

export const PostCard = ({ post, compact = false, isOwner, onEdit, onDelete, onLike }: PostCardProps) => {
  const [showMenu, setShowMenu] = useState(false)

  const authorName = post.user.name ?? post.user.username ?? 'Teachgram'
  const authorUsername = post.user.username ? `@${post.user.username}` : '@teachgram'
  const initials = authorName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  return (
    <article className={`post-card ${compact ? 'post-card--compact' : ''}`}>
      <header className="post-card__header d-flex align-items-center justify-content-between p-3">
        <div className="d-flex align-items-center gap-2">
          <div className="post-card__avatar-img rounded-circle d-flex align-items-center justify-content-center text-white small fw-bold" style={{ width: 36, height: 36, background: getAccent(post.id) }}>
            {initials || 'T'}
          </div>
          <div className="d-flex flex-column">
            <strong className="text-dark small lh-1 mb-1">{authorUsername}</strong>
            <span className="text-muted" style={{ fontSize: '0.7rem' }}>{authorName}</span>
          </div>
        </div>
        {isOwner && (
          <div className="position-relative">
            <button className="btn btn-link text-muted p-0 text-decoration-none" onClick={() => setShowMenu(!showMenu)}>⋮</button>
            {showMenu && (
              <div className="position-absolute bg-white border rounded shadow-sm end-0 mt-1 py-1" style={{ zIndex: 10, minWidth: 120 }}>
                <button className="btn btn-link text-dark text-decoration-none w-100 text-start small px-3 py-1" onClick={() => { onEdit?.(post.id); setShowMenu(false) }}>Editar</button>
                <button className="btn btn-link text-danger text-decoration-none w-100 text-start small px-3 py-1" onClick={() => { onDelete?.(post.id); setShowMenu(false) }}>Excluir</button>
              </div>
            )}
          </div>
        )}
      </header>

      <div className="px-3 pb-2">
        <p className="small mb-2 text-dark">
          <Link to={`/post/${post.id}`} className="text-decoration-none text-dark fw-medium">
            {post.title}
          </Link>
          {' '}
          <span className="text-muted fw-normal">{post.description}</span>
        </p>
      </div>

      <div
        className="post-card__media w-100"
        style={
          post.photoLink
            ? {
                backgroundImage: `url(${post.photoLink})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '240px',
              }
            : { background: getAccent(post.id), minHeight: '180px' }
        }
      />

      <footer className="post-card__footer p-3 d-flex align-items-center">
        <button type="button" className="btn btn-link btn-sm p-0 text-danger text-decoration-none d-flex align-items-center gap-2" onClick={() => onLike?.(post.id)}>
          <span style={{ fontSize: '1.2rem' }}>♥</span>
          <span className="text-muted small fw-medium">{post.likesCount} curtidas</span>
        </button>
      </footer>
    </article>
  )
}
