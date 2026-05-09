import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'

import Nav from './static/Nav'
import Footer from './static/Footer'

import Styles from './pages/Styles'
import Home from './pages/Home'
import Error from './pages/Error'
import Rsvp from './pages/Rsvp'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'

export default function App() {
  return (
    <LanguageProvider>
      <main>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rsvp" element={<Rsvp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/styles" element={<Styles />} />
          <Route path="*" element={<Error code={404} />} />
        </Routes>
        <Footer />
      </Router>
      </main>
    </LanguageProvider>
  )
}