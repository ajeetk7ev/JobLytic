import { Routes, Route } from "react-router-dom"
import { SignupPage } from "./pages/Signup"
import { LoginPage } from "./pages/Login"
import ForgotPassword from "./pages/Forgot-password"
import UpdatePassword from "./pages/Update-password"

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>This is home page</div>} />
      <Route path="/signup" element={<SignupPage/>} />
      <Route path="/login" element={<LoginPage/>} />
       <Route path='/forgot-password' element={<ForgotPassword />} />
       <Route path='/reset-password/:id' element={<UpdatePassword />} />
    </Routes>
  )
}

export default App