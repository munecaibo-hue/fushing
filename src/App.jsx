import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import GM from './pages/GM.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/gm" element={<GM />} />
    </Routes>
  )
}
