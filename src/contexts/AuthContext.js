//BIBLIOTECAS
import React, {useEffect, useState} from 'react'
//SERVIÇOS
import {signInWithPopup, authentication, provider} from '../services/firebase' 

//VARIAVEL DE CONTEXTUALIZAÇÃO
export const AuthContext = React.createContext({})

function AuthContextFunction (props) {

  //HOOK PARA GUARDAR O USUARIO LOGADO
  const [user, setUser] = useState(null)

  //VERIFICA SE O USUÁRIO JÁ ESTÁ LOGADO
  useEffect(()=>{
    const unsubscribe = authentication.onAuthStateChanged((user) => {
      if (user) {
        //SEPARANDO OS VALORES OBTIDOS COMO RESPOSTA
        const { displayName, photoURL, uid } = user

        if (!displayName || !photoURL) {
          throw new Error('Usuário com informações incompletas!')
        }

        setUser({ name: displayName, avatar: photoURL, id: uid })
      }

    })

    //FECHAR O EVENT LISTENER DE PROCURAR USUARIO LOGADO
    return () => {
      unsubscribe()
    }
  }, [])

  
  //FUNÇÃO PARA REALIZAR O LOG IN COM O GOOGLE
  async function logInWithGoogle () {

    const res = await signInWithPopup(authentication, provider)
    
    if(!res.user){throw new Error('Usuário não encontrado') }

    const {displayName, photoURL, uid} = res.user

    if(!displayName || !photoURL){throw new Error("Usuário com informações pendentes!")}

    setUser({name: displayName, avatar: photoURL, id: uid})

  }


  return(
    <AuthContext.Provider value={{user, logInWithGoogle}}>
      {props.children}
    </AuthContext.Provider>
  )

}

export default AuthContextFunction