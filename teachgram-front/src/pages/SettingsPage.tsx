import { useEffect, useState, type FormEvent } from 'react'
import type { User as AuthUser } from '../models/User'
import { getApiErrorMessage } from '../services/errorService'
import { deleteCurrentUser, updateCurrentUser } from '../services/userService'

interface SettingsPageProps {
  currentUser: AuthUser | null
  onCurrentUserChange: (user: AuthUser | null) => void
  onLogout: () => void
}

export const SettingsPage = ({ currentUser, onCurrentUserChange, onLogout }: SettingsPageProps) => {
  const [form, setForm] = useState({
    name: currentUser?.name ?? '',
    username: currentUser?.username ?? '',
    email: currentUser?.email ?? '',
    phone: currentUser?.phone ?? '',
    bio: currentUser?.bio ?? '',
    profileLink: currentUser?.profileLink ?? '',
    password: '',
  })

  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [view, setView] = useState<'menu' | 'account' | 'profile'>('menu')
  const [showDeleteAccount, setShowDeleteAccount] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setForm({
      name: currentUser?.name ?? '',
      username: currentUser?.username ?? '',
      email: currentUser?.email ?? '',
      phone: currentUser?.phone ?? '',
      bio: currentUser?.bio ?? '',
      profileLink: currentUser?.profileLink ?? '',
      password: '',
    })
  }, [currentUser])

  const persistChanges = async () => {
    setLoading(true)
    setErrorMessage('')
    setMessage('')

    try {
      const updatedUser = await updateCurrentUser(form)
      onCurrentUserChange(updatedUser)
      setMessage('Configurações salvas com sucesso.')
      setView('menu')
      setForm((current) => ({ ...current, password: '' }))
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Nao foi possivel atualizar o perfil.'))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await persistChanges()
  }

  const handleDelete = async () => {
    setLoading(true)
    setErrorMessage('')

    try {
      await deleteCurrentUser()
      onCurrentUserChange(null)
      onLogout()
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Nao foi possivel excluir a conta.'))
      setLoading(false)
    }
  }

  return (
    <div className="p-4 p-md-5 w-100">
      {view === 'menu' && (
        <div style={{ maxWidth: 320 }}>
          <button type="button" className="btn btn-link p-0 text-danger text-decoration-none mb-4 d-flex align-items-center gap-2" onClick={() => window.history.back()}>
            <span style={{ fontSize: '1.2rem' }}>←</span>
          </button>

          <div className="d-flex flex-column gap-4 mt-2">
            <button type="button" className="btn btn-link text-dark text-decoration-none text-start d-flex justify-content-between align-items-center p-0 fw-medium" onClick={() => setView('account')}>
              Configurações da conta <span className="text-muted">›</span>
            </button>
            <button type="button" className="btn btn-link text-dark text-decoration-none text-start d-flex justify-content-between align-items-center p-0 fw-medium" onClick={() => setView('profile')}>
              Editar perfil <span className="text-muted">›</span>
            </button>
            <button type="button" className="btn btn-link text-danger text-decoration-none text-start p-0 fw-medium mt-2" onClick={() => setShowDeleteAccount(true)}>
              Excluir conta
            </button>
          </div>
        </div>
      )}

      {view === 'account' && (
        <div style={{ maxWidth: 360 }}>
          <div className="d-flex align-items-center gap-3 mb-4">
            <button type="button" className="btn btn-link p-0 text-danger text-decoration-none d-flex align-items-center" onClick={() => setView('menu')}>
              <span style={{ fontSize: '1.2rem' }}>←</span>
            </button>
          </div>
          <h2 className="h6 fw-bold mb-4">Configurações da conta</h2>

          <div className="d-flex flex-column gap-3 mb-4">
            <div>
              <label className="text-dark small fw-bold mb-1">Nome</label>
              <input className="form-control form-control-sm bg-light border-0" value={currentUser?.name || ''} disabled />
            </div>
            <div>
              <label className="text-dark small fw-bold mb-1">Username</label>
              <input className="form-control form-control-sm bg-light border-0" value={currentUser?.username || ''} disabled />
            </div>
            <div>
              <label className="text-dark small fw-bold mb-1">E-mail</label>
              <input className="form-control form-control-sm bg-light border-0" value={currentUser?.email || ''} disabled />
            </div>
            <div>
              <label className="text-dark small fw-bold mb-1">Senha</label>
              <input type="password" className="form-control form-control-sm bg-light border-0" value="••••••••" disabled />
            </div>
          </div>

          <button type="button" className="btn btn-danger btn-sm px-4 rounded-pill" onClick={() => setView('profile')}>
            Editar
          </button>
        </div>
      )}

      {view === 'profile' && (
        <div style={{ maxWidth: 360 }}>
          <div className="d-flex align-items-center gap-3 mb-4">
            <button type="button" className="btn btn-link p-0 text-danger text-decoration-none d-flex align-items-center" onClick={() => setView('menu')}>
              <span style={{ fontSize: '1.2rem' }}>←</span>
            </button>
          </div>

          {message ? <div className="auth-alert auth-alert--success mb-3">{message}</div> : null}
          {errorMessage ? <div className="auth-alert auth-alert--error mb-3">{errorMessage}</div> : null}

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
            <div className="d-flex flex-column align-items-center gap-2 mb-2">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white h3 mb-0"
                style={
                  form.profileLink
                    ? {
                        width: 80, height: 80,
                        backgroundImage: `url(${form.profileLink})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        color: 'transparent',
                      }
                    : { width: 80, height: 80, background: '#7f7f7f' }
                }
              >
                {!form.profileLink && (form.name?.[0] ?? 'M')}
              </div>
              <label className="text-center w-100">
                <span className="text-danger small" style={{ cursor: 'pointer' }}>Insira o link da sua foto de perfil...</span>
                <input type="text" className="d-none" value={form.profileLink} onChange={(e) => setForm({ ...form, profileLink: e.target.value })} />
              </label>
            </div>

            <div className="d-flex flex-column gap-3">
              <div>
                <label className="text-dark small fw-bold mb-1">Nome</label>
                <input className="form-control form-control-sm bg-light border-0" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="text-dark small fw-bold mb-1">Nome de usuário</label>
                <input className="form-control form-control-sm bg-light border-0" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
              </div>
              <div>
                <label className="text-dark small fw-bold mb-1">Bio</label>
                <textarea rows={3} className="form-control form-control-sm bg-light border-0" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
                <small className="text-muted d-block mt-1" style={{ fontSize: '0.65rem' }}>Adicione no máximo detalhes em até 150 caracteres <span className="text-danger">▼</span></small>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button type="button" className="btn btn-outline-secondary btn-sm px-4 rounded-pill" onClick={() => setView('menu')}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-danger btn-sm px-4 rounded-pill" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {showDeleteAccount && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.1)', zIndex: 1050 }}>
          <div className="bg-white rounded-4 p-4 shadow-sm text-center" style={{ width: 320 }}>
            <h3 className="h6 fw-bold mb-2">Excluir conta</h3>
            <p className="small text-muted mb-4">Tem certeza que deseja excluir sua conta?</p>
            <div className="d-flex justify-content-center gap-3">
              <button type="button" className="btn btn-outline-secondary btn-sm px-4 rounded-pill" onClick={() => setShowDeleteAccount(false)}>
                Cancelar
              </button>
              <button type="button" className="btn btn-danger btn-sm px-4 rounded-pill" onClick={handleDelete} disabled={loading}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
