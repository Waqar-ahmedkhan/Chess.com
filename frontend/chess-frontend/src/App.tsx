import { Route, Routes } from 'react-router-dom'
import './App.css'
import Game from './screens/Game'
import Landing from './screens/Landing'
import NoFound from './screens/NoFound'

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Landing/>} />
      <Route path="*" element={<NoFound />} />
      <Route path="/game" element={<Game/>} />
    </Routes>
    
    </>
  )
}

export default App
