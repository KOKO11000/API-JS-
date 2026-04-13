
import { Route, Routes } from 'react-router'
import './App.css'
import Home from './pages/Home'
import Aircrafts from './pages/Aircrafts'
import Aircraft_type from './pages/Aircraft_type'
import Flights from './pages/Flights'

function App() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/airbase.jpg')" }}
    >
      {/* Overlay כהה */}
     <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90"></div>

      {/* תוכן האפליקציה */}
      <div className="relative z-10 text-white">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/aircrafts' element={<Aircrafts />} />
          <Route path='/aircraft-type' element={<Aircraft_type />} />
          <Route path='/flights' element={<Flights />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
