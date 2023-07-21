import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Chess from './chess/Chess.tsx'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas, far);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={ <App /> } />
        <Route path="/chess" element={ <Chess /> } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
