import heroImg from '../assets/hero.png'
import logoImg from '../assets/logo.png'
import { LoginForm } from '../components/LoginForm'
import type { User } from '../models/User'

interface AuthPageProps {
  initialMode?: 'login' | 'register'
  onAuthenticated: (user: User) => void
}

export const AuthPage = ({ initialMode = 'login', onAuthenticated }: AuthPageProps) => {
  return (
    <main className="auth-page">
      <section className="auth-shell" aria-label="Área de autenticação">
        <div className="auth-card">
          <div className="auth-content">
            <div className="auth-form-panel">
              <LoginForm initialMode={initialMode} onAuthenticated={onAuthenticated} />
            </div>
            <div className="auth-illustration" aria-hidden="true">
              <img className="auth-illustration__logo" src={logoImg} alt="" />
              <img src={heroImg} alt="" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
