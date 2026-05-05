import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Error from './pages/Error'
import Rsvp from './pages/Rsvp'

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rsvp" element={<Rsvp />} />
        <Route path="*" element={<Error code={404} />} />
      </Routes>
    </Router>
  )
}