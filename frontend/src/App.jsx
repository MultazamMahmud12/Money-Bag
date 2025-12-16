import { Outlet } from "react-router-dom"
import { AuthProvide } from "./context/AuthContext"
import Navbar from "./components/Navbar"

function App() {
 

  return (
    <>
    <AuthProvide>
     <nav><Navbar/></nav>
    <Outlet/>
    <footer>Footer</footer>
    </AuthProvide>

   
    </>
  )
}

export default App
