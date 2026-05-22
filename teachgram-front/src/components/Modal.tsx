import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  open: boolean
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Modal = ({ open, title, subtitle, onClose, children, size = 'md', className }: ModalProps) => {
  useEffect(() => {
    if (!open) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.classList.add('modal-open')

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('modal-open')
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  return createPortal(
    <div
      className="teachgram-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="teachgram-modal-title"
      onMouseDown={onClose}
    >
      <div
        className={`teachgram-modal__panel teachgram-modal__panel--${size} ${className ?? ''}`.trim()}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="teachgram-modal__header">
          <div>
            <h2 id="teachgram-modal-title" className="teachgram-modal__title">
              {title}
            </h2>
            {subtitle ? <p className="teachgram-modal__subtitle mb-0">{subtitle}</p> : null}
          </div>
          <button type="button" className="teachgram-modal__close" aria-label="Fechar" onClick={onClose}>
            <span aria-hidden="true">x</span>
          </button>
        </div>

        <div className="teachgram-modal__body">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
