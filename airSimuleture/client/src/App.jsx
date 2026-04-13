
import { Route, Routes } from 'react-router'
import './App.css'
import Home from './pages/Home'
import Aircrafts from './pages/Aircrafts'
import Aircraft_type from './pages/Aircraft_type'
import Flights from './pages/Flights'

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/aircrafts' element={<Aircrafts />} />
        <Route path='/aircraft-type' element={<Aircraft_type />} />
        <Route path='/flights' element={<Flights />} />

      </Routes>
    </div>
  )
}

export default App
