//BIBLIOTECAS
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
//COMPONENTES
import App from './App'
//ESTILIZAÇÃO
import './styles/global.scss'

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
)
