import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyARGareTpBEa1GrfI4og9C5f7I4ab-9buQ",
    authDomain: "invernadero-a0e85.firebaseapp.com",
    databaseURL: "https://invernadero-a0e85-default-rtdb.firebaseio.com", 
    projectId: "invernadero-a0e85",
    storageBucket: "invernadero-a0e85.firebasestorage.app",
    messagingSenderId: "2152191338",
    appId: "1:2152191338:web:1433e0c243bc04b9870113",
    measurementId: "G-6EF5CSRL3B"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener la referencia de la Base de Datos
export const database = getDatabase(app);

// Obtener la referencia de la Autenticación
export const auth = getAuth(app);