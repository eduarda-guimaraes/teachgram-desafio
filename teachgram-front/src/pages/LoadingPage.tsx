import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { User as AuthUser } from '../models/User'
import logoImg from '../assets/logo.png'

interface LoadingPageProps {
  currentUser: AuthUser | null
}

export const LoadingPage = ({ currentUser }: LoadingPageProps) => {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate('/feed', { replace: true })
    }, 1400)

    return () => window.clearTimeout(timer)
  }, [navigate])

  return (
    <main className="loading-page container-fluid min-vh-100 d-flex align-items-center justify-content-center">
      <div className="loading-page__card text-center d-grid gap-3">
        <img className="loading-page__brand img-fluid" src={logoImg} alt="Teachgram" />
        <div className="spinner-border text-white" role="status" aria-label="Carregando" />
        <p className="loading-page__status mb-0 fw-semibold text-white">Carregando...</p>
        <small className="text-white-50">{currentUser?.name ?? 'Teachgram'}</small>
      </div>
    </main>
  )
}
