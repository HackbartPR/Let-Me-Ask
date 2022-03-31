import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child, set, push, onValue, onChildAdded, off, remove } from 'firebase/database';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

//CONFIGURAÇÕES DO BANCO DE DADOS
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
}

//INICIALIZA O SERVIÇO DE BANCO DE DADOS COM AS CONFIGURAÇÕES ACIMA
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

//VERIAVEIS PARA AUTENTICAÇÃO
const authentication = getAuth();
const provider = new GoogleAuthProvider();

export {signInWithPopup, authentication, provider, GoogleAuthProvider, database, get, child, set, push, onValue, onChildAdded, off, remove, ref }
