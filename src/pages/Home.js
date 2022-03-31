//BIBLIOTECAS
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
//IMAGES
import illustration_img from '../assets/images/illustration.svg'
import logo_img from '../assets/images/logo.svg'
//ESTILIZAÇÃO
import '../styles/home.scss'
import '../assets/fonts-icons/style.css'
//COMPONENTES
import Button from '../components/Button'
//CONTEXTUALIZAÇÃO
import {AuthContext} from '../contexts/AuthContext'
//SERVIÇOS
import {findRoom} from '../hooks/useRoom'


function Home() {
  //FUNÇÃO DE NAVEGAÇÃO
  const navigate = useNavigate()
  //FUNÇÕES DA CONTEXTUALIZAÇÕES
  const {user, logInWithGoogle} = React.useContext(AuthContext)
  //HOOK PARA RECEBER A SALA DIGITADA
  const [room, setRoom] = useState('')

  //CLIQUE DO BOTÃO LOGAR COM O GOOGLE
  async function handleLogin (event) {
    event.preventDefault()

    if(!user) {
      await logInWithGoogle()
    }
    
    navigate('/rooms/new')
  }

  //SUBMIT DO FORMULÁRIO => ENTRAR EM UMA SALA EXISTENTE
  async function handleFindRoom (event) {
    event.preventDefault()

    if(!room.trim() === '') {return }

    const roomExist =  await findRoom(room)

    if(!roomExist) {throw new Error("Sala não encontrada")}

    navigate(`/rooms/${room}`)

    setRoom('')
  }

  return (
    <div className="home flex">
      <div className="sidebar flex">
        <img className="sidebar__img"  src={illustration_img} alt='Representação de entrar nas salas.' />
        <h1 className='sidebar__title'>Toda pergunta tem uma resposta.</h1>
        <p className='sidebar_text'>Aprenda e compartilhe conhecimento com outras pessoas.</p>
      </div>
      <div className="login flex">
        <div className='login__container flex'>
          <img className='login__img' src={logo_img} alt='Logo do Let Me Ask' />
          <button className='login__google' onClick={handleLogin}>
            <i className='login__google_icon icon-google-icon' />
            Crie sua sala com o Google
          </button>
          <div className='login__divisor flex'> ou entre em uma sala </div>
          <form className='login__form flex' onSubmit={handleFindRoom}>
            <input className='login__input' placeholder="Digite o código da sala" 
            onChange={(event)=>setRoom(event.target.value)} value={room}/>
            <Button>
              <div className='login__button flex'>
                <i className='icon-log-in login__button_icon' />
                Entrar na sala
              </div>              
            </Button>
          </form>  
        </div>
      </div>
    </div>
  )
}

export default Home
