import { useState, type FormEvent } from 'react'
import type { User as AuthUser } from '../models/User'
import heroImg from '../assets/hero.png'
import { createPost } from '../services/postService'
import { getApiErrorMessage } from '../services/errorService'

interface NewPostPageProps {
  currentUser: AuthUser | null
}

const initialValues = {
  title: '',
  description: '',
  visibility: 'public',
  resourceLink: '',
}

export const NewPostPage = ({ currentUser }: NewPostPageProps) => {
  const [form, setForm] = useState(initialValues)
  const [step, setStep] = useState<'link' | 'compose'>('link')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setErrorMessage('')

    try {
      await createPost({
        title: form.title || 'Nova publicação',
        description: form.description,
        photoLink: form.resourceLink || undefined,
        isPrivate: form.visibility === 'private',
      })

      setMessage('Sua publicação foi compartilhada com sucesso.')
      setForm(initialValues)
      setStep('link')
      window.history.back()
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Não foi possível criar a publicação.'))
    } finally {
      setLoading(false)
    }
  }

  const handleNext = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStep('compose')
  }

  return (
    <div className="friends-page position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1040, background: 'rgba(0,0,0,0.4)' }}>
      <div className="friends-page__backdrop" onClick={() => window.history.back()} style={{ cursor: 'pointer' }} />

      <div className="bg-white rounded-4 shadow-lg position-relative" style={{ width: 360, zIndex: 1050, overflow: 'hidden' }}>
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
          <button type="button" className="btn btn-link text-danger p-0 text-decoration-none" onClick={() => step === 'compose' ? setStep('link') : window.history.back()}>
            <span style={{ fontSize: '1.2rem' }}>←</span>
          </button>
          <h2 className="h6 fw-bold mb-0">Criar nova publicação</h2>
          <span className="text-danger small" style={{ cursor: 'pointer' }}>Salvar</span>
        </div>

        <div className="p-3">
          {message && <div className="auth-alert auth-alert--success mb-3">{message}</div>}
          {errorMessage && <div className="auth-alert auth-alert--error mb-3">{errorMessage}</div>}

          {step === 'link' ? (
            <form onSubmit={handleNext} className="d-flex flex-column gap-3">
              <div className="d-flex flex-column gap-2 text-center py-4">
                <div className="bg-light rounded-3 d-flex align-items-center justify-content-center mx-auto" style={{ width: 200, height: 200, border: '1px dashed #ccc' }}>
                  {form.resourceLink ? (
                    <img src={form.resourceLink} alt="Preview" className="w-100 h-100 object-fit-cover rounded-3" />
                  ) : (
                    <span className="text-muted small">Sem imagem</span>
                  )}
                </div>
                <label className="text-danger small fw-medium" style={{ cursor: 'pointer' }}>
                  Adicionar imagem...
                  <input type="text" className="d-none" value={form.resourceLink} onChange={(e) => setForm({ ...form, resourceLink: e.target.value })} />
                </label>
              </div>

              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="rounded-circle text-white d-flex align-items-center justify-content-center small fw-bold" style={{ width: 32, height: 32, background: '#f2746f' }}>
                  {currentUser?.name?.[0] ?? 'M'}
                </div>
                <div className="d-flex flex-column">
                  <strong className="text-dark lh-1" style={{ fontSize: '0.8rem' }}>{currentUser?.name ?? 'Teachgram'}</strong>
                  <span className="text-muted" style={{ fontSize: '0.7rem' }}>@{currentUser?.username ?? 'teachgram'}</span>
                </div>
              </div>

              <textarea
                className="form-control form-control-sm bg-light border-0"
                rows={3}
                placeholder="Insira a descrição da sua publicação"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              <div className="d-flex justify-content-center mt-2">
                <button type="submit" className="btn btn-danger btn-sm px-4 rounded-pill">
                  Avançar
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              <div className="d-flex flex-column gap-2 text-center py-4">
                <div className="bg-light rounded-3 mx-auto" style={{ width: 200, height: 200 }}>
                  <img src={form.resourceLink || heroImg} alt="Preview" className="w-100 h-100 object-fit-cover rounded-3" />
                </div>
              </div>

              <input
                className="form-control form-control-sm bg-light border-0 mb-2"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Título da publicação"
              />

              <div className="d-flex justify-content-center mt-2">
                <button type="submit" className="btn btn-danger btn-sm px-4 rounded-pill" disabled={loading}>
                  {loading ? 'Publicando...' : 'Publicar'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
