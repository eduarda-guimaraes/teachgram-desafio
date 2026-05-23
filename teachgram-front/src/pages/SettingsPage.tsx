import { useEffect, useState, type FormEvent } from 'react'
import type { User as AuthUser } from '../models/User'
import { Modal } from '../components/Modal'
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
  const [notifications, setNotifications] = useState(true)
  const [weeklySummary, setWeeklySummary] = useState(true)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [showDeleteAccount, setShowDeleteAccount] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
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
      setMessage('Configuracoes salvas com sucesso.')
      setShowEditProfile(false)
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
    <div className="page-layout page-layout--settings">
      <section className="content-panel content-panel--wide">
        <div className="content-panel__header">
          <div>
            <p className="section-eyebrow">Conta</p>
            <h2>Atualize suas informacoes</h2>
          </div>
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setShowEditProfile(true)}>
            Editar perfil
          </button>
        </div>

        <form className="settings-form" onSubmit={handleSubmit}>
          <div className="form-grid form-grid--two">
            <label className="field">
              <span>Nome</span>
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
            <label className="field">
              <span>Username</span>
              <input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
            </label>
          </div>

          <label className="field">
            <span>E-mail</span>
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </label>

          <div className="form-grid form-grid--two">
            <label className="field">
              <span>Celular</span>
              <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            </label>
            <label className="field">
              <span>Foto de perfil</span>
              <input value={form.profileLink} onChange={(event) => setForm({ ...form, profileLink: event.target.value })} />
            </label>
          </div>

          <label className="field">
            <span>Bio</span>
            <textarea rows={5} value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} />
          </label>

          <label className="field">
            <span>Nova senha</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Preencha apenas se quiser trocar"
            />
          </label>

          {message ? <div className="auth-alert auth-alert--success">{message}</div> : null}
          {errorMessage ? <div className="auth-alert auth-alert--error">{errorMessage}</div> : null}

          <div className="form-actions">
            <button type="button" className="secondary-button" onClick={() => setShowDeleteAccount(true)}>
              Excluir conta
            </button>
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar alteracoes'}
            </button>
          </div>
        </form>
      </section>

      <aside className="page-aside">
        <section className="content-panel content-panel--aside">
          <div className="content-panel__header">
            <div>
              <p className="section-eyebrow">Preferencias</p>
              <h2>Notificacoes e resumo</h2>
            </div>
          </div>

          <div className="toggle-list">
            <label className="toggle-item">
              <div>
                <strong>Notificacoes instantaneas</strong>
                <p>Receba alertas quando alguem interagir com suas publicacoes.</p>
              </div>
              <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} />
            </label>

            <label className="toggle-item">
              <div>
                <strong>Resumo semanal</strong>
                <p>Veja um resumo das suas interacoes todas as segundas-feiras.</p>
              </div>
              <input type="checkbox" checked={weeklySummary} onChange={() => setWeeklySummary(!weeklySummary)} />
            </label>
          </div>
        </section>
      </aside>

      <Modal
        open={showEditProfile}
        title="Editar perfil"
        subtitle="Atualize sua foto, nome e bio"
        onClose={() => setShowEditProfile(false)}
        size="sm"
        className="teachgram-modal--profile"
      >
        <form
          className="teachgram-modal__stack"
          onSubmit={async (event) => {
            event.preventDefault()
            await persistChanges()
          }}
        >
          <div className="teachgram-profile-modal__avatar-row">
            <div
              className="teachgram-profile-modal__avatar"
              style={
                form.profileLink
                  ? {
                      backgroundImage: `url(${form.profileLink})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      color: 'transparent',
                    }
                  : undefined
              }
            >
              {form.name?.[0] ?? 'M'}
            </div>
            <div className="teachgram-profile-modal__hint">
              <strong>Foto de perfil</strong>
              <span>{form.profileLink || 'Adicione um link de imagem para aparecer aqui.'}</span>
            </div>
          </div>

          <label className="field">
            <span>Nome</span>
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </label>
          <label className="field">
            <span>Nome de usuario</span>
            <input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
          </label>
          <label className="field">
            <span>Bio</span>
            <textarea rows={3} value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} />
          </label>

          <div className="teachgram-modal__actions">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowEditProfile(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              Atualizar
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={showDeleteAccount}
        title="Excluir conta"
        subtitle="Todos os seus dados serao removidos"
        onClose={() => setShowDeleteAccount(false)}
        size="sm"
        className="teachgram-modal--confirm"
      >
        <div className="teachgram-modal__stack teachgram-modal__stack--center">
          <p className="mb-0 small text-muted">Tem certeza que deseja continuar?</p>
          <div className="teachgram-modal__actions teachgram-modal__actions--center">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowDeleteAccount(false)}>
              Cancelar
            </button>
            <button type="button" className="btn btn-danger btn-sm" onClick={handleDelete} disabled={loading}>
              Confirmar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
