//BIBLIOTECA
import React, {useContext, useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom' 
//IMAGES
import illustration_img from '../assets/images/illustration.svg'
import logo_img from '../assets/images/logo.svg'
//COMPONENTES
import Button from '../components/Button'
//ESTILIZAÇÃO
import '../styles/newRoom.scss'
//CONTEXTUALIZAÇÃO
import {AuthContext} from '../contexts/AuthContext'
//SERVICES
import {createRoom} from '../hooks/useRoom'

function NewRoom () {
  //CONTEXTUALIZAÇÃO
  const {user} = useContext(AuthContext)
  //NAVEGAÇÃO
  const navigate = useNavigate()
  //HOOK PARA GUARDAR A SALA DIGITADA
  const [roomName, setRoomName] = useState('')

  useEffect(()=>{

    //VERIFICA SE O USUÁRIO ESTÁ LOGADO
    if(!user){ navigate('/') }

  }, [])


  async function handleCreateRoom (event) {
    event.preventDefault()

    if(roomName.trim() === '') {
      alert('Por favor, digite o nome da sala')
      setRoomName('')
    }

    let newRoomKey = await createRoom(roomName, user)

    setRoomName('')

    navigate(`/admin/rooms/${newRoomKey}`)

  }

  return (
    <div className="newRoom flex">
      <div className="sidebar flex">
        <img className="sidebar__img"  src={illustration_img} alt='Representação de entrar nas salas.' />
        <h1 className='sidebar__title'>Toda pergunta tem uma resposta.</h1>
        <p className='sidebar_text'>Aprenda e compartilhe conhecimento com outras pessoas.</p>
      </div>
      <div className="newRoom flex">
        <div className='newRoom__container flex'>
          <img className='newRoom__img' src={logo_img} alt='Logo do Let Me Ask' />
          <h1 className='newRoom__title'>Crie uma nova sala</h1>
          <form className='newRoom__form flex' onSubmit={handleCreateRoom}>
            <input className='newRoom__input' placeholder="Nome da sala" 
            onChange={event=>{return setRoomName(event.target.value)}} value={roomName}/>
            <Button>
              Criar sala
            </Button>
          </form>
          <p className='newRoom__text'>Quer entrar em uma sala já existente? <Link to='/' className='newRoom__link'>Clique aqui</Link></p>  
        </div>
      </div>
    </div>
  )
}

export default NewRoom