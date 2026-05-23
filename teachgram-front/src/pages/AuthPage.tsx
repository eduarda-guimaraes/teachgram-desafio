import heroImg from '../assets/hero.png'
import logoImg from '../assets/logo.png'
import { LoginForm } from '../components/LoginForm'
import type { AuthResponse } from '../types'

interface AuthPageProps {
  initialMode?: 'login' | 'register'
  onAuthenticated: (auth: AuthResponse) => void
}

export const AuthPage = ({ initialMode = 'login', onAuthenticated }: AuthPageProps) => {
  return (
    <main className="auth-page container-fluid min-vh-100 p-2 p-md-3 p-lg-4">
      <section className="auth-shell row justify-content-center align-items-stretch g-0" aria-label="Área de autenticação">
        <div className="col-12 col-xl-8 col-xxl-7">
          <div className="auth-card card border-0 shadow-sm overflow-hidden rounded-4">
            <div className="auth-content row g-0">
              <div className="auth-form-panel col-12 col-lg-5 order-2 order-lg-1 d-flex align-items-center">
                <LoginForm initialMode={initialMode} onAuthenticated={onAuthenticated} />
              </div>
              <div className="auth-illustration col-12 col-lg-7 order-1 order-lg-2 position-relative">
                <img className="auth-illustration__logo position-absolute top-0 start-0 m-3" src={logoImg} alt="" />
                <img className="img-fluid w-100 h-100 object-fit-cover" src={heroImg} alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
