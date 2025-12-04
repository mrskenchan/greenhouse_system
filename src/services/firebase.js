import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyDzaqbPwY1_DFDfrI80aKesCtevsLkxjIU",
    authDomain: "invernadero-v2.firebaseapp.com",
    databaseURL: "https://invernadero-v2-default-rtdb.firebaseio.com", 
    projectId: "invernadero-v2",
    storageBucket: "invernadero-v2.firebasestorage.app",
    messagingSenderId: "200557096758",
    appId: "1:200557096758:web:f6b1e94ff436a9ca394d97",
    measurementId: "G-D9Z3L6PVZC"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener la referencia de la Base de Datos
export const database = getDatabase(app);

// Obtener la referencia de la Autenticación
export const auth = getAuth(app);