import { Route, Routes } from 'react-router'
import './App.css'
import Home from './pages/Home'
import Aircrafts from './pages/Aircrafts'
import Aircraft_type from './pages/Aircraft_type'
import Flights from './pages/Flights'

function App() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-linear-to-br from-slate-950 via-blue-950 to-slate-950"
    >
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(0deg,transparent_24%,rgba(6,182,212,.05)_25%,rgba(6,182,212,.05)_26%,transparent_27%,transparent_74%,rgba(6,182,212,.05)_75%,rgba(6,182,212,.05)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(6,182,212,.05)_25%,rgba(6,182,212,.05)_26%,transparent_27%,transparent_74%,rgba(6,182,212,.05)_75%,rgba(6,182,212,.05)_76%,transparent_77%,transparent)] bg-[length:50px_50px]"></div>

      {/* Animated glow effect */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-5"></div>

      {/* Content */}
      <div className="relative z-10 text-white min-h-screen">
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
