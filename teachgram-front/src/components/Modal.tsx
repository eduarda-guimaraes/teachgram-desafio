import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  open: boolean
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export const Modal = ({ open, title, subtitle, onClose, children, size = 'md' }: ModalProps) => {
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
        className={`teachgram-modal__dialog teachgram-modal__dialog--${size} modal-dialog modal-dialog-centered`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-content border-0 rounded-4 shadow-lg">
          <div className="modal-header border-0 pb-2">
            <div>
              <h2 id="teachgram-modal-title" className="modal-title h6 fw-bold mb-1">
                {title}
              </h2>
              {subtitle ? <p className="teachgram-modal__subtitle text-muted small mb-0">{subtitle}</p> : null}
            </div>
            <button type="button" className="btn-close" aria-label="Fechar" onClick={onClose} />
          </div>

          <div className="modal-body pt-2">{children}</div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
