import { useEffect, useState, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { AuthPage } from './pages/AuthPage'
import { FeedPage } from './pages/FeedPage'
import { FriendsPage } from './pages/FriendsPage'
import { LoadingPage } from './pages/LoadingPage'
import { NewPostPage } from './pages/NewPostPage'
import { PostDetailsPage } from './pages/PostDetailsPage'
import { ProfilePage } from './pages/ProfilePage'
import { SettingsPage } from './pages/SettingsPage'
import { getStoredToken } from './services/api'
import { logoutUser } from './services/authService'
import { fetchCurrentUser } from './services/userService'
import type { AuthResponse, User } from './types'
import './App.css'

const STORAGE_KEY = 'teachgram.currentUser'

const loadStoredUser = (): User | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)

  if (!stored) {
    return null
  }

  try {
    return JSON.parse(stored) as User
  } catch {
    return null
  }
}

const AppRoutes = () => {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadStoredUser())
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    const token = getStoredToken()

    if (!token) {
      setBooting(false)
      return
    }

    fetchCurrentUser()
      .then((user) => setCurrentUser(user))
      .catch(() => {
        logoutUser()
        setCurrentUser(null)
      })
      .finally(() => setBooting(false))
  }, [])

  useEffect(() => {
    if (currentUser) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser))
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [currentUser])

  const handleAuthenticated = (auth: AuthResponse) => {
    setCurrentUser(auth.user)
    navigate('/carregando', { replace: true })
  }

  const handleLogout = () => {
    logoutUser()
    setCurrentUser(null)
    navigate('/login', { replace: true })
  }

  const withShell = (page: ReactNode) => (
    <AppShell currentUser={currentUser} onLogout={handleLogout}>
      {page}
    </AppShell>
  )

  const requireAuth = (page: ReactNode) =>
    currentUser ? page : <Navigate to="/login" replace />

  const requireGuest = (page: ReactNode) =>
    currentUser ? <Navigate to="/feed" replace /> : page

  if (booting) {
    return <LoadingPage />
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={currentUser ? '/feed' : '/login'} replace />} />
      <Route path="/login" element={requireGuest(<AuthPage initialMode="login" onAuthenticated={handleAuthenticated} />)} />
      <Route path="/register" element={requireGuest(<AuthPage initialMode="register" onAuthenticated={handleAuthenticated} />)} />
      <Route path="/carregando" element={requireAuth(<LoadingPage />)} />
      <Route path="/feed" element={requireAuth(withShell(<FeedPage currentUser={currentUser} />))} />
      <Route path="/amigos" element={requireAuth(withShell(<FriendsPage />))} />
      <Route path="/publicar" element={requireAuth(withShell(<NewPostPage currentUser={currentUser} />))} />
      <Route path="/post/:id" element={requireAuth(withShell(<PostDetailsPage currentUser={currentUser} />))} />
      <Route path="/perfil" element={requireAuth(withShell(<ProfilePage currentUser={currentUser} />))} />
      <Route path="/perfil/:id" element={requireAuth(withShell(<ProfilePage currentUser={currentUser} />))} />
      <Route
        path="/configuracoes"
        element={requireAuth(withShell(<SettingsPage currentUser={currentUser} onCurrentUserChange={setCurrentUser} onLogout={handleLogout} />))}
      />
      <Route path="*" element={<Navigate to={currentUser ? '/feed' : '/login'} replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
