import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "invernadero-a0e85",
    authDomain: "invernadero-a0e85-default-rtdb.firebaseio.com",
    databaseURL: "https://invernadero-a0e85-default-rtdb.firebaseio.com/", 
    projectId: "2152191338",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener la referencia de la Base de Datos
export const database = getDatabase(app);

// Obtener la referencia de la Autenticación
export const auth = getAuth(app);