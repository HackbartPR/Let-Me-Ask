//BIBLIOTECAS
import React, { useContext, useState } from 'react'
import {useParams, useNavigate, Link} from 'react-router-dom'
import toast, {Toaster} from 'react-hot-toast'
//IMAGENS / ICONES
import logo_img from '../assets/images/logo.svg'
import '../assets/fonts-icons/style.css'
import empty_img from '../assets/images/empty-questions.svg'
//ESTILIZAÇÃO
import '../styles/userRoom.scss'
//COMPONENTES
import Cards from '../components/Cards'
import Button from '../components/Button'
//CONTEXTUALIZAÇÃO
import {AuthContext} from '../contexts/AuthContext'
//HOOKS
import {GetMessages, GetRoomTitle, createMessage, insertLike, deleteLike} from '../hooks/useRoom'



function UserRoom () {
  //CONTEXTUALIZAÇÃO
  const {user} = useContext(AuthContext)
  //RECEBE O PARAMETRO ROOM ID DA URL
  const params =  useParams()
  const roomID = params.id
  //RECEBE TODAS AS PERGUNTAS SALVAS
  const {questions, loading} = GetMessages(roomID)
  //RECEBE O TÍTULO DA SALA
  const roomTitle = GetRoomTitle(roomID)
  //HOOK PARA NAVEGAÇÃO
  const navigate = useNavigate()
  //HOOK PARA GUARDAR A PERGUNTA QUE ESTÁ SENDO FEITA
  const [newQuestion, setNewQuestion] = useState('')

  //CONFIGURA OS TOASTS POSTADOS
  function handleUseToast (type, text) {
    if(type === 'success'){
      toast.success(text,{
        duration: 2000,
        className: 'userRoom__toast',
        id: 'success'
      })
    }else if (type === 'loading'){
      toast.loading(text,{
        duration: 2000,
        className: 'userRoom__toast',        
      })
    }else if (type === 'error'){
      toast.error(text,{
        duration: 2000,
        className: 'userRoom__toast',
        id: 'error'
      })
    }  
  }

  //COPIA O ROOMID 
  function handleCopyRoomId () {
    navigator.clipboard.writeText(roomID)
    handleUseToast('success', 'Copiado!')
  }

  //CRIAR UMA NOVA MENSAGEM
  async function handleCreateMessage (event) {
    event.preventDefault()

    const isCreate = await createMessage(roomID, user, newQuestion)

    isCreate ? (handleUseToast('success', 'Pergunta realizada!')) : (handleUseToast('error', 'Houve algum problema!'))

    setNewQuestion('')
  }

  //INSERIR UM LIKE EM UMA PERGUNTA
  async function handleInsertLike (questionID, likeID) {

    if(likeID){
      deleteLike(roomID, questionID, likeID)
    }else{
      insertLike(roomID, questionID, user.id)
    }
        
  }
  
  //APRESENTA O TOAST DE BOAS VINDAS ASISM QUE A PÁGINA É CARREGADA
  loading && handleUseToast('success', 'Bem Vindo(a)!')
  
  //APRESENTA TELA DE LOADING CASO AS PERGUNTAS NÃO TENHAM SIDO CARREGADAS
  if(loading && roomTitle === ''){
    return(
      <div className='userRoom'>
      <header className='userRoom__header flex'>
        <img src={logo_img} className='userRoom__logo' alt=''/>
        <div className='userRoom__header__buttons flex'>              
          <div className='userRoom__roomNumber__container flex'>
            <div className='userRoom__roomNumber_copy flex' onClick={handleCopyRoomId}>
              <i className='userRoom__roomNumber_icon icon-copy' />
            </div>
            <div className='userRoom__roomNumber_number'>{`Sala #${roomID}`}</div>
          </div>
        </div>
      </header>
      <div className='userRoom__container__loading flex'>
        <div className='userRoom__loader'></div>
      </div>        
    </div>
    )
  }

  //PÁGINA APÓS TODOS OS DADOS SEREM CARREGADOS
  return (
    
    <div className='userRoom'>                 
      <header className='userRoom__header flex'>
        <img src={logo_img} className='userRoom__logo' alt=''/>                   
          <div className='userRoom__roomNumber__container flex'>
            <div className='userRoom__roomNumber_copy flex' onClick={handleCopyRoomId}>
              <i className='userRoom__roomNumber_icon icon-copy' />
            </div>
            <div className='userRoom__roomNumber_number'>{`Sala #${roomID}`}</div>
          </div>        
      </header>

      <div className='userRoom__container flex'>
        <div className='userRoom__container__title flex'>
          <div className='userRoom__roomTitle'>
            {roomTitle !== '' && (`Sala ${roomTitle}`)}
          </div>
          {questions.length > 0 && (
            <div className='userRoom__questionsNumber'>
            {questions.length > 0 && (`${questions.length} pergunta(s)`)}
          </div>)}          
        </div>

        <div className='userRoom__container__formulario flex'>
          <form className='userRoom__formulario' onSubmit={handleCreateMessage}>
            <textarea className='userRoom__textArea' onChange={(e)=>{setNewQuestion(e.target.value)}} placeholder='O que você quer perguntar?' value={newQuestion}/>
            <div className='userRoom__formulario__footer flex'>
              {user ? (
                <div className='userRoom__formulario__user flex'>
                  <img className='userRoom__formulario__avatar' src={user.avatar}/>
                  <p className='userRoom__formulario__userName'>{user.name}</p>
                </div>): (
                  <p className='userRoom__formulario_link'>Para enviar uma pergunta, <Link to={'/'}><span className='userRoom__link'>faça seu login.</span></Link></p>)}

              {user ? (
                <div className='userRoom__formulario__button'>
                  <Button >Enviar pergunta</Button>
                </div>):(
                <div className='userRoom__formulario__button'>
                  <Button disabled>Enviar pergunta</Button>
                </div>)}
            </div>
          </form>
                
        </div>
        {questions.length == 0 ? (
          <div className='userRoom__container__noCards flex'>
            <img src={empty_img} alt='' />
            <h1 className='userRoom__container__noCards__title'>Nenhuma pergunta por aqui...</h1>
            <p className='userRoom__container__noCards__text'>Seja a primeira pessoa a fazer uma pergunta!</p>
          </div>):(        
          <div className='userRoom__container__cards flex'>
            {questions.map(question=>{
              return (
                <Cards 
                isAdmin={false} 
                author={question.author} 
                content={question.content} 
                key={question.id}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted} 
                handleInsertLike={()=>{handleInsertLike(question.id, question.likeID)}}
                countLikes={question.countLikes}
                likeID={question.likeID && true}
                />)
            })}
          </div>)}        
        
      </div>
      <Toaster />        
    </div>
  )    

}

export default UserRoom