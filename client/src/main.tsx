import React from 'react'
import ReactDOM from 'react-dom/client'
// import {PortProvider} from "@/contexts/PortContextProvider.tsx";
// import {AppContextProvider} from "@/contexts/AppContextProvider.tsx";
import App from './App.tsx'
import 'virtual:windi.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
)
