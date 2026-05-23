import { Link } from 'react-router-dom'
import type { Post } from '../types'

interface PostCardProps {
  post: Post
  compact?: boolean
  onLike?: (postId: number) => void
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))

const getAccent = (id: number) => {
  const palettes = [
    'linear-gradient(135deg, #ff8b72, #ffcf9a)',
    'linear-gradient(135deg, #f86f8f, #ffb3c7)',
    'linear-gradient(135deg, #ffb24d, #ffdca4)',
    'linear-gradient(135deg, #7fb4ff, #cce0ff)',
  ]

  return palettes[(id - 1) % palettes.length]
}

export const PostCard = ({ post, compact = false, onLike }: PostCardProps) => {
  const authorName = post.user.name ?? post.user.username ?? 'Teachgram'
  const authorUsername = post.user.username ? `@${post.user.username}` : '@teachgram'
  const initials = authorName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  return (
    <article className={compact ? 'post-card post-card--compact' : 'post-card'}>
      <div
        className="post-card__media"
        style={
          post.photoLink
            ? {
                backgroundImage: `linear-gradient(rgba(17, 10, 8, 0.08), rgba(17, 10, 8, 0.08)), url(${post.photoLink})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : { background: getAccent(post.id) }
        }
      >
        <div className="post-card__media-overlay" />
        <div className="post-card__avatar" aria-hidden="true">
          {initials || 'T'}
        </div>
        <span className={post.isPrivate ? 'post-badge post-badge--private' : 'post-badge'}>
          {post.isPrivate ? 'Privado' : 'Público'}
        </span>
      </div>

      <div className="post-card__body">
        <div className="post-card__meta">
          <div>
            <p className="post-card__author">{authorName}</p>
            <p className="post-card__username">{authorUsername}</p>
          </div>
          <span className="post-card__date">{formatDate(post.createdAt)}</span>
        </div>

        <h3 className="post-card__title">
          <Link to={`/post/${post.id}`}>{post.title}</Link>
        </h3>
        <p className="post-card__description">{post.description}</p>

        <div className="post-card__footer">
          <div className="post-card__stats">
            <button type="button" className="btn btn-link btn-sm p-0 text-link" onClick={() => onLike?.(post.id)}>
              ❤ {post.likesCount}
            </button>
            <span>{post.videoLink ? '▶ Vídeo' : '🖼 Foto'}</span>
          </div>
          <Link className="text-link" to={`/post/${post.id}`}>
            Ver detalhes
          </Link>
        </div>
      </div>
    </article>
  )
}
