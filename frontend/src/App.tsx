import { Routes, Route } from "react-router-dom"
import { SignupPage } from "./pages/Signup"
import { LoginPage } from "./pages/Login"

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>This is home page</div>} />
      <Route path="/signup" element={<SignupPage/>} />
       <Route path="/login" element={<LoginPage/>} />
    </Routes>
  )
}

export default App