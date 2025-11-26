## 🌿 Sistema de Invernadero IoT
Plataforma web para la monitorización y control automatizado de un invernadero inteligente. Este sistema permite visualizar datos de sensores en tiempo real, gestionar ciclos de cultivo y controlar el riego de forma remota mediante una conexión bidireccional con Arduino.

## 🚀 Tecnologías Utilizadas
El proyecto está construido con las siguientes dependencias clave:

- Frontend: React + Vite (Rápido y ligero).
- Routing: react-router-dom (Navegación entre Dashboard, Calendario, etc).
- Base de Datos & Auth: firebase (Realtime Database y Authentication).
- Gráficos: recharts (Visualización histórica de temperatura).
- Notificaciones: react-hot-toast (Alertas visuales emergentes).
- Estilos: CSS Modules / CSS Nativo con diseño Glassmorphism.

---

## 📋 Pre-requisitos
Antes de empezar, asegúrate de tener instalado:
1. Node.js (Versión 16 o superior) - Descargar aquí.
2. Arduino IDE (Para cargar el código a la placa).
3. Git (Para clonar el repositorio).

---

## ⚙️ Instalación del Proyecto Web
Sigue estos pasos para levantar la página web en tu computadora:

1. Clonar el repositorio: https://github.com/mrskenchan/greenhouse_system.git
2. Instalar dependencias:
  - react-router-dom = Navegación entre páginas (Dashboard, Calendario, Sensores).
  - firebase = Conexión a Base de Datos en tiempo real y Autenticación.
  - recharts = Gráficos de temperatura e historial de sensores.
  - react-hot-toast = Notificaciones emergentes (Pop-ups) bonitas.
  - date-fns = Cálculo de días para el calendario de germinación.

---
## 🛠️ Pasos para Instalar y Ejecutar (Para Compañeros)
Si acabas de descargar o clonar este repositorio, sigue estos pasos exactos para que no falte nada:

Paso A: Instalar Node Modules
Abre la terminal en la carpeta del proyecto y ejecuta este comando. Instalará todas las dependencias mencionadas arriba automáticamente leyendo el archivo package.json:
- npm install

  > Nota: Si por alguna razón eso falla, puedes instalarlas manualmente copiando y pegando esta línea:
  > npm i react-router-dom firebase recharts react-hot-toast date-fns
  
Paso B: Configurar Credenciales
- El proyecto necesita las llaves de acceso.
- Crea un archivo llamado firebase.js dentro de la carpeta src/services/.
- Pide al dueño del proyecto (o copia de tu cuenta) el contenido de configuración (apiKey, authDomain, etc).

Paso C: Iniciar el Servidor
Para ver la página web: npm run dev

---
## 🤖 Dependencias del Hardware (Arduino)
Para que el código del Arduino compile, necesitas instalar lo siguiente en el Arduino IDE:

- Gestor de Tarjetas (Boards Manager):
- Busca e instala: Arduino UNO R4 Boards (por Arduino).
- Esto instalará automáticamente las librerías WiFi (WiFiS3) necesarias.
- Librerías Adicionales (Library Manager):
- Servo (Normalmente viene preinstalada, pero verifica).
- LiquidCrystal (Para la pantalla LCD).

---
## 🔗 Estructura de Carpetas Clave
```
/src
  /components   -> Piezas de LEGO (Tarjetas, Botones, Gráficos)
  /context      -> Lógica global (Auth, Greenhouse Data)
  /hooks        -> Funciones personalizadas (useSensors, useAuth)
  /pages        -> Vistas completas (Dashboard, Login)
  /services     -> Conexión con Firebase
```

---
## 👨‍💻 Autores
Desarrollado por 
[Kenjiro Aguilera](https://github.com/mrskenchan).
[Victor Ugalde](https://github.com/MSWINDOW87).
[Matías Moreno](https://github.com/MatiasMoreno2).
[Matías Ulloa](https://github.com/Hankk21).

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
