import { useEffect, useState, type FormEvent } from 'react'
import { loginUser, registerUser } from '../services/authService'
import type { LoginCredentials, RegisterCredentials, User } from '../models/User'
import logoImg from '../assets/logo.png'

type AuthMode = 'login' | 'register'

type FormState = {
  name: string
  email: string
  username: string
  bio: string
  phone: string
  password: string
  confirmPassword: string
}

const initialFormState: FormState = {
  name: '',
  email: '',
  username: '',
  bio: '',
  phone: '',
  password: '',
  confirmPassword: '',
}

interface LoginFormProps {
  initialMode?: AuthMode
  onAuthenticated?: (user: User) => void
}

export const LoginForm = ({ initialMode = 'login', onAuthenticated }: LoginFormProps) => {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [form, setForm] = useState<FormState>(initialFormState)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    setMode(initialMode)
    setErrorMessage('')
    setSuccessMessage('')
    setForm(initialFormState)
  }, [initialMode])

  const updateField = (field: keyof FormState) => (value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode)
    setErrorMessage('')
    setSuccessMessage('')
    setForm((current) => ({
      ...current,
      password: '',
      confirmPassword: '',
    }))
  }

  const handleLogin = async (credentials: LoginCredentials) => {
    const user = await loginUser(credentials)
    setSuccessMessage(`Bem-vindo, ${user.name ?? user.username}.`)
    onAuthenticated?.(user)
    return user
  }

  const handleRegister = async (credentials: RegisterCredentials) => {
    const user = await registerUser(credentials)
    setMode('login')
    setErrorMessage('')
    setSuccessMessage('Conta criada com sucesso. Agora você pode entrar.')
    setForm({
      ...initialFormState,
      email: credentials.email,
    })
    return user
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      if (mode === 'login') {
        await handleLogin({
          email: form.email.trim(),
          password: form.password,
        })
        return
      }

      if (form.password !== form.confirmPassword) {
        setErrorMessage('As senhas precisam ser iguais.')
        return
      }

      await handleRegister({
        name: form.name.trim(),
        email: form.email.trim(),
        username: form.username.trim(),
        password: form.password,
        phone: form.phone.trim() || undefined,
        bio: form.bio.trim() || undefined,
      })
    } catch {
      setErrorMessage(
        mode === 'login'
          ? 'E-mail ou senha inválidos. Verifique seus dados e tente novamente.'
          : 'Não foi possível criar a conta. Verifique se e-mail e usuário já não estão em uso.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-form-shell w-100">
      <div className="auth-brand mb-4 text-center text-lg-start">
        <img className="auth-brand__logo img-fluid" src={logoImg} alt="Teachgram" />
      </div>

      <form className="auth-form d-grid gap-3" onSubmit={handleSubmit}>
        <header className="auth-form__header">
          <h2 className="h6 fw-bold mb-1">{mode === 'login' ? 'Faça seu login' : 'Crie sua conta'}</h2>
          <p className="text-muted small mb-0">
            {mode === 'login'
              ? 'Use seu e-mail e sua senha para acessar.'
              : 'Preencha os campos abaixo para começar.'}
          </p>
        </header>

        <div className="d-grid gap-2">
          {mode === 'register' ? (
            <>
              <div className="mb-1">
                <label className="form-label small fw-semibold mb-1">Nome</label>
                <input
                  className="form-control form-control-sm"
                  autoComplete="name"
                  placeholder="Digite seu nome"
                  value={form.name}
                  onChange={(e) => updateField('name')(e.target.value)}
                />
              </div>

              <div className="mb-1">
                <label className="form-label small fw-semibold mb-1">E-mail</label>
                <input
                  className="form-control form-control-sm"
                  autoComplete="email"
                  placeholder="Digite seu e-mail"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email')(e.target.value)}
                />
              </div>

              <div className="mb-1">
                <label className="form-label small fw-semibold mb-1">Username</label>
                <input
                  className="form-control form-control-sm"
                  autoComplete="username"
                  placeholder="@seu_usuario"
                  value={form.username}
                  onChange={(e) => updateField('username')(e.target.value)}
                />
              </div>

              <div className="mb-1">
                <label className="form-label small fw-semibold mb-1">Descrição</label>
                <input
                  className="form-control form-control-sm"
                  placeholder="Fale um pouco sobre você"
                  value={form.bio}
                  onChange={(e) => updateField('bio')(e.target.value)}
                />
              </div>

              <div className="mb-1">
                <label className="form-label small fw-semibold mb-1">Celular</label>
                <input
                  className="form-control form-control-sm"
                  autoComplete="tel"
                  placeholder="Digite seu número de celular"
                  value={form.phone}
                  onChange={(e) => updateField('phone')(e.target.value)}
                />
              </div>
            </>
          ) : (
            <div className="mb-1">
              <label className="form-label small fw-semibold mb-1">E-mail</label>
              <input
                className="form-control form-control-sm"
                autoComplete="email"
                placeholder="Digite seu e-mail"
                type="email"
                value={form.email}
                onChange={(e) => updateField('email')(e.target.value)}
              />
            </div>
          )}

          <div className="mb-1">
            <label className="form-label small fw-semibold mb-1">Senha</label>
            <input
              className="form-control form-control-sm"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              placeholder="Digite sua senha"
              type="password"
              value={form.password}
              onChange={(e) => updateField('password')(e.target.value)}
            />
          </div>

          {mode === 'register' ? (
            <div className="mb-1">
              <label className="form-label small fw-semibold mb-1">Confirmar senha</label>
              <input
                className="form-control form-control-sm"
                autoComplete="new-password"
                placeholder="Repita a sua senha"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => updateField('confirmPassword')(e.target.value)}
              />
            </div>
          ) : null}
        </div>

        {mode === 'login' ? (
          <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap">
            <label className="form-check d-flex align-items-center gap-2 mb-0">
              <input className="form-check-input m-0" type="checkbox" />
              <span className="form-check-label small">Lembrar-me</span>
            </label>

            <button type="button" className="btn btn-link btn-sm p-0 text-decoration-none">
              Recuperar senha
            </button>
          </div>
        ) : null}

        {errorMessage ? (
          <div className="alert alert-danger py-2 mb-0 small" role="alert">
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="alert alert-success py-2 mb-0 small" role="status">
            {successMessage}
          </div>
        ) : null}

        <button className="btn btn-primary w-100 fw-semibold" type="submit" disabled={loading}>
          {loading ? (mode === 'login' ? 'Entrando...' : 'Criando conta...') : mode === 'login' ? 'Entrar' : 'Próximo'}
        </button>

        {mode === 'login' ? (
          <>
            <div className="text-center text-muted small">ou continue com</div>

            <div className="d-grid gap-2">
              <button type="button" className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center gap-2">
                <span aria-hidden="true">G</span>
                <span>Entrar com Google</span>
              </button>
              <button type="button" className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center gap-2">
                <span aria-hidden="true"></span>
                <span>Entrar com Apple</span>
              </button>
            </div>
          </>
        ) : null}

        <p className="auth-form__footer text-center small mb-0">
          {mode === 'login' ? (
            <>
              Não possui conta?{' '}
              <button type="button" className="btn btn-link btn-sm p-0 align-baseline" onClick={() => switchMode('register')}>
                Cadastre-se
              </button>
            </>
          ) : (
            <>
              Já possui conta?{' '}
              <button type="button" className="btn btn-link btn-sm p-0 align-baseline" onClick={() => switchMode('login')}>
                Entrar
              </button>
            </>
          )}
        </p>
      </form>
    </section>
  )
}
