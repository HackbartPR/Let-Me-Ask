//BIBLIOTECA
import React from 'react'
import {Routes, Route} from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
//COMPONENTES
import Home from './pages/Home'
import NewRoom from './pages/NewRoom'
import UserRoom from './pages/UserRoom'
import AdminRoom from './pages/AdminRoom'
//ESTILIZAÇÃO
import './styles/global.scss'
//CONTEXTUALIZAÇÃO
import AuthContextfunction from './contexts/AuthContext'

function App() {

  return (
    <AuthContextfunction>
      <Routes>
        <Route path='/' exact element={<Home />} />
        <Route path='/rooms/new' exact element={<NewRoom />} />
        <Route path='/rooms/:id' element={<UserRoom />} />
        <Route path='/admin/rooms/:id' exact element={<AdminRoom />} />
      </Routes>
    </AuthContextfunction>
  )
}

export default App
