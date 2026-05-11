import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import DashboardPage from './pages/DashboardPage'
import HistorialPage from './pages/HistorialPage'
import AlertasPage from './pages/AlertasPage'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/historial" element={<HistorialPage />} />
        <Route path="/alertas" element={<AlertasPage />} />
      </Routes>
    </Router>
  )
}

export default App
