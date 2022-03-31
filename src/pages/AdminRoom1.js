//BIBLIOTECAS
import React, { useContext, useState } from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import toast, {Toaster} from 'react-hot-toast'
//IMAGENS / ICONES
import logo_img from '../assets/images/logo.svg'
import '../assets/fonts-icons/style.css'
import empty_img from '../assets/images/empty-questions.svg'
//ESTILIZAÇÃO
import '../styles/adminRoom.scss'
//COMPONENTES
import Button from '../components/Button'
import Cards from '../components/Cards'
//CONTEXTUALIZAÇÃO
import {AuthContext} from '../contexts/AuthContext'
//HOOKS
import {GetMessages, GetRoomTitle, deleteRoom, findRoom} from '../hooks/useRoom'



function AdminRoom () {
  //CONTEXTUALIZAÇÃO
  const {user} = useContext(AuthContext)
  //RECEBE O PARAMETRO ROOM ID DA URL
  const params =  useParams()
  const roomID = params.id
  //RECEBE TODAS AS PERGUNTAS SALVAS
  const {questions, loading} = GetMessages(roomID)
  //RECEBE O TÍTULO DA SALA
  const roomTitle = GetRoomTitle(roomID)
  //RECEBE O STATUS SHOW DO BUTTON DE DELETAR PÁGINA
  const [showDeleteRoom, setShowDeleteRoom] = useState(false)
  //HOOK PARA NAVEGAÇÃO
  const navigate = useNavigate()


  //CONFIGURA OS TOASTS POSTADOS
  function handleUseToast (type, text) {
    if(type === 'success'){
      toast.success(text,{
        duration: 2000,
        className: 'adminRoom__toast',
        id: 'success'
      })
    }else if (type === 'loading'){
      toast.loading(text,{
        duration: 2000,
        className: 'adminRoom__toast',        
      })
    }else if (type === 'error'){
      toast.error(text,{
        duration: 2000,
        className: 'adminRoom__toast',
        id: 'error'
      })
    }  
  }

  //COPIA O ROOMID 
  function handleCopyRoomId () {
    navigator.clipboard.writeText(roomID)
    handleUseToast('success', 'Copiado!')
  }

  //APAGAR SALA
  async function handleDeleteRoom () {
    setShowDeleteRoom(false)

    //DELETA A SALA
    await deleteRoom(roomID)
    //VERIFICA SE A SALA AINDA EXISTE
    const stillExist =  await findRoom(roomID)

    if(stillExist === false){
      handleUseToast('success', 'Sala deletada!')
      navigate('/')
    }else if(stillExist === true) {
      handleUseToast('error','Acesso negado!')
    } 
       
  }

  //DELETAR UMA QUESTÃO
  async function handleDeleteQuestion (questionID) {
    console.log(questionID)
  }
  
  //APRESENTA O TOAST DE BOAS VINDAS ASISM QUE A PÁGINA É CARREGADA
  loading && handleUseToast('success', 'Bem Vindo(a)!')
  
  //APRESENTA TELA DE LOADING CASO AS PERGUNTAS NÃO TENHAM SIDO CARREGADAS
  if(loading && roomTitle === ''){
    return(
      <div className='adminRoom'>
      <header className='adminRoom__header flex'>
        <img src={logo_img} className='adminRoom__logo' alt=''/>
        <div className='adminRoom__header__buttons flex'>              
          <div className='adminRoom__roomNumber__container flex'>
            <div className='adminRoom__roomNumber_copy flex' onClick={handleCopyRoomId}>
              <i className='adminRoom__roomNumber_icon icon-copy' />
            </div>
            <div className='adminRoom__roomNumber_number'>{`Sala #${roomID}`}</div>
          </div>
        </div>
      </header>
      <div className='adminRoom__container__loading flex'>
        <div className='adminRoom__loader'></div>
      </div>        
    </div>
    )
  }

  //PÁGINA APÓS TODOS OS DADOS SEREM CARREGADOS
  return (
    
    <div className='adminRoom'>
      {showDeleteRoom && 
        (<div className='modal__deleteRoom show'>
        <div className='modal__deleteRoom__container flex'>
          <i className='modal__deleteRoom__icon icon-cross'/>
          <h1 className='modal__deleteRoom__title'>Encerrar sala</h1>
          <p className='modal__deleteRoom__text'>Tem certeza que você deseja encerrar esta sala?</p>
          <div className='modal__deleteRoom__buttons_container flex'>
            <button className='modal__deleteRoom__btnCancel' 
            onClick={()=>{setShowDeleteRoom(false)}}>Cancelar</button>
            <button className='modal__deleteRoom__btnConfirm'
            onClick={handleDeleteRoom}>Sim, encerrar</button>
          </div>
        </div>
      </div>)}
           
      <header className='adminRoom__header flex'>
        <img src={logo_img} className='adminRoom__logo' alt=''/>
        <div className='adminRoom__header__buttons flex'>              
          <div className='adminRoom__roomNumber__container flex'>
            <div className='adminRoom__roomNumber_copy flex' onClick={handleCopyRoomId}>
              <i className='adminRoom__roomNumber_icon icon-copy' />
            </div>
            <div className='adminRoom__roomNumber_number'>{`Sala #${roomID}`}</div>
          </div>
          <Button className='outlined' 
          onClick={()=>{setShowDeleteRoom(true)}}>Encerrar sala</Button>
        </div>
      </header>
      <div className='adminRoom__container flex'>
        <div className='adminRoom__container__title flex'>
          <div className='adminRoom__roomTitle'>
            {roomTitle !== '' && (`Sala ${roomTitle}`)}
          </div>
          {questions.length > 0 && (
            <div className='adminRoom__questionsNumber'>
            {questions.length > 0 && (`${questions.length} pergunta(s)`)}
          </div>
          )}
          
        </div>
        {questions.length == 0 ? 
        (
          <div className='adminRoom__container__noCards flex'>
            <img src={empty_img} alt='' />
            <h1 className='adminRoom__container__noCards__title'>Nenhuma pergunta por aqui...</h1>
            <p className='adminRoom__container__noCards__text'>Envie o código desta sala para seus amigos e começe a responder perguntas!</p>
          </div>
        ):(
          <div className='adminRoom__container__cards flex'>
            {questions.map(question=>{
              return (
                <Cards isAdmin={true} author={question.author} content={question.content} key={question.id} handleDeleteQuestion={()=>handleDeleteQuestion(question.id)}/>)
            })}
          </div>
        )}
                    
      </div>
      <Toaster />        
    </div>
  )    

}

export default AdminRoom