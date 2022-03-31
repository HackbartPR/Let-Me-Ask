//BIBLIOTECAS
import {useEffect, useState, useContext, useRef} from 'react'
//SERVIÇOS
import {ref, child, get, database, set, push, off, onValue} from '../services/firebase'
import { AuthContext } from '../contexts/AuthContext'
import { update } from 'firebase/database'


//BUSCAR TODAS AS MENSAGENS ENVIADAS PARA UMA SALA ESPECÍFICA NO BANCO DE DADOS
export function GetMessages (roomID) {
  //RECEBER O USUÁRIO LOGADO
  const {user} = useContext(AuthContext)
  //GUARDA TODAS AS PERGUNTAS ENCONTRADAS
  const [questions, setQuestions] = useState([])
  //GUARDA O STATUS DE LOADING
  const [loading, setLoading] = useState(true)
  
  
  useEffect(()=>{
    const dbRef = ref(database, `rooms/${roomID}/questions`)

    //EVENT LISTENER
    onValue(dbRef, snapshot =>{
      
      if(snapshot.val() == null ){        
        setQuestions(``)
        setLoading(false)
      }else{
        const objQuestions = Object.entries(snapshot.val()).map(([key, value])=>{                                    
          
          return({
            id: key,
            author: value.author,
            content: value.content,
            isHighlighted: value.isHighlighted,
            isAnswered: value.isAnswered,
            countLikes: Object.values(value.likes ?? {}).length,
            likeID: Object.entries(value.likes ?? {}).find(([key, value]) => value.authorID === user.id)?.[0]
          })
        })

        setQuestions(objQuestions)
        setLoading(false)
      }      
    })

    return(()=>{
      off(dbRef)
    })

  }, [roomID, user?.id])

  
  return {questions, loading}
}


  /* useEffect(()=>{
    const dbRef = ref(database, `rooms/${roomID}/questions`)

    //EVENT LISTENER
    onValue(dbRef, snapshot =>{
      
      if(snapshot.val() == null ){
        setLoading(false)
      }else{
        const objQuestions = Object.entries(snapshot.val()).map(([key, value])=>{                                    
          
          return({
            id: key,
            author: value.author,
            content: value.content,
            isHighlighted: value.isHighlighted,
            isAnswered: value.isAnswered,
            countLikes: Object.values(value.likes ?? {}).length,
            likeID: Object.entries(value.likes ?? {}).find(([key, value]) => value.authorID === user.id)?.[0]
          })
        })

        setQuestions(objQuestions)
        setLoading(false)
      }      
    })

    return(()=>{
      off(dbRef)
    })

  }, [roomID, user?.id])

  
  return {questions, loading}
} */

//CRIA A SALA NO BANCO DADOS
export async function createRoom (roomName, user) {
  //SALVA AS INFORMAÇÕES NO BANCO DE DADOS
  const roomRef = ref(database, 'rooms')
  const newRoom = push(roomRef)

  await set(newRoom, {
    title: roomName,
    authorID: user.id,
  }).catch(error => {throw new Error(error)})

  return newRoom.key
}

//PROCURA PELA SALA DIGITADA PELO USUÁRIO NO BANCO DE DADOS
export async function findRoom (roomSent) {
  //GUARDAR STATUS DE ENCONTRADO OU NÃO
  let roomExist = false
 
  //REALIZA A BUSCA NO BANCO DE DADOS
  const dbRef = ref(database)
  const snapshot = await get(child(dbRef, 'rooms'))

  //TRANSFORMA O SNASHOT EM UM ARRAY E PERCORRE TODAS AS SALAS
  Object.entries(snapshot.val()).map((room) =>{
    room[0] == roomSent && (roomExist = true)
  })

  return roomExist
}

//BUSCAR O NOME DA SALA
export function GetRoomTitle (roomID) {
  const [title, setTitle] = useState('')

  const dbRef = ref(database)
  get(child(dbRef, `rooms/${roomID}`)).then(snapshot=>{
    setTitle(snapshot.val().title)
  })

  return title  
}

//APAGAR UMA SALA
export async function deleteRoom (roomID) {
  //REMOVER A SALA
  const dbRef = database
  await set(ref(dbRef, `rooms/${roomID}`), null).catch(error =>{
    return error
  })
}

//INSERIR UMA PERGUNTA
export async function createMessage (roomID, user, content) {
  let isCreate = false

  const dbRef = database
  const roomRef = ref(dbRef, `rooms/${roomID}/questions`)
  const newMessage = push(roomRef)

  await set(newMessage, {
    content: content,
    author: user, 
    isAnswered: false,
    isHighlighted: false,
  })
  .then(()=>{isCreate = true})
  .catch(error=>{return error})

  return isCreate
}

//INSERIR UM LIKE
export async function insertLike (roomID, questionID, userID) {
  let isCreate = false

  const dbRef = database
  const questRef = ref(dbRef,`rooms/${roomID}/questions/${questionID}/likes`)
  const newLike = push(questRef)

  await set(newLike, {
    authorID: userID,
  })
  .then(()=>{isCreate = true})
  .catch(error =>{return error})

  return isCreate
}

//DELETAR UM LIKE
export async function deleteLike (roomID, questionID, likeID) {
  const dbRef = database
  await set(ref(dbRef, `rooms/${roomID}/questions/${questionID}/likes/${likeID}`), null).catch(error =>{
    return error
  })
}

//DELETAR UMA PERGUNTA
export async function deleteQuestion (roomID, questionID) {
  const dbRef = database

  await set(ref(dbRef, `rooms/${roomID}/questions/${questionID}`), null).catch(error =>{
    return error
  })

}

//MARCAR UMA PERGUNTA COMO RESPONDIDA
export async function checkQuestionAsAnswered (roomID, questionID) {
  const dbRef = database
  const roomRef = ref(dbRef, `rooms/${roomID}/questions/${questionID}`)

  await update(roomRef, {isAnswered: true})
  await update(roomRef, {isHighlighted: false})

  /* return(()=>{
    off(dbRef)
  }) */
} 

//MARCAR PERGUNTA COMO ESTÁ SENDO RESPONDIDA (HIGHLIGHT)
export async function highlightQuestion (roomID, questionID) {
  const dbRef = database
  const roomRef = ref(dbRef, `rooms/${roomID}/questions/${questionID}`)
  
  await update(roomRef, {isHighlighted: true})
  
  /* return(()=>{
    off(dbRef)
  }) */
  
}
