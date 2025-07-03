import { BrowserRouter } from "react-router-dom"
import RoutePaths from "./components/RoutePaths.tsx"
import NavBar from "./components/NavBar.tsx"
import Footer from "./components/Footer.tsx"
import "./index.css"

function App() {
  return (
    <BrowserRouter>
      <section className="app-container">
        <NavBar />
        <RoutePaths />
        <Footer />
      </section>
    </BrowserRouter>
  )
}

export default App
