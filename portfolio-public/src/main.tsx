import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import Chess from "./chess/Chess.tsx"
import Samples from "./Samples.tsx"
import Nav from "./Nav.tsx"
import "../index.css"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core"
import { far } from "@fortawesome/free-regular-svg-icons"
import { fas } from "@fortawesome/free-solid-svg-icons"

// Add FontAwesome icons to library for Chess component
library.add(fas, far);

const isChessDomain = window.location.hostname === 'chess.pointlesswaste.com';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route index element={ isChessDomain ? <Chess /> : <App /> } />
        <Route path="/chess" element={ <Chess /> } />
        <Route path="/samples" element={ <Samples /> } />
      </Routes>
    </BrowserRouter>
)