import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import Chess from "./chess/Chess.tsx"
import Samples from "./Samples.tsx"
import "./index.css"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core"
import { far } from "@fortawesome/free-regular-svg-icons"
import { fas } from "@fortawesome/free-solid-svg-icons"
library.add(fas, far);

function toggleMenu(){
  var menu = document.getElementsByClassName("menudropdown")[0];
  var isHidden = menu.className.search("hide") > -1;
  menu.className = "menudropdown" + (isHidden ? "" : " hide");
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <div className="menucontrol">
      <a href="http://www.pointlesswaste.com/samples" style={{ fontSize: 12 }} >View samples!</a>&nbsp;
      <div className="menubutton fa-solid fa-bars" onClick={toggleMenu} />
      <div className="printbutton fa-solid fa-print" onClick={() => { window.print() }} />
      <div className="menudropdown hide">
        <div className="menupanel">
          <div onClick={toggleMenu}><a className="menulink" target="_top" href="http://www.pointlesswaste.com">Résumé</a></div>
          <div onClick={toggleMenu}><a className="menulink" target="_top" href="http://www.pointlesswaste.com/chess">Chess (React/Vite/NestJS)</a></div>
          <div onClick={toggleMenu}><a className="menulink" target="_blank" href="https://github.com/scarabdesign">GitHub</a></div>
          <div onClick={toggleMenu}><a className="menulink" target="_blank" href="https://www.linkedin.com/in/sean-hankins/">LinkedIn</a></div>
          <div onClick={toggleMenu}><a className="menulink" target="_top" href="http://www.pointlesswaste.com/samples">Sample Porfolio</a></div>
        </div>
      </div>
    </div>
    <BrowserRouter>
      <Routes>
        <Route index element={ <App /> } />
        <Route path="/chess" element={ <Chess /> } />
        <Route path="/samples" element={ <Samples /> } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
