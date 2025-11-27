import { Routes, Route } from "react-router-dom"
import { SignupPage } from "./pages/Signup"
import { LoginPage } from "./pages/Login"
import ForgotPassword from "./pages/Forgot-password"
import UpdatePassword from "./pages/Update-password"
import ResumeUploadPage from "./pages/ResumeUpload"
import WorkSpace from "./pages/Workspace"

function App() {
  return (
    <Routes>
    
      <Route path="/signup" element={<SignupPage/>} />
      <Route path="/login" element={<LoginPage/>} />
       <Route path='/forgot-password' element={<ForgotPassword />} />
       <Route path='/reset-password/:id' element={<UpdatePassword />} />
       <Route path="/resume-upload" element={<ResumeUploadPage/>} />
       <Route path="/" element={<WorkSpace/>} />
    </Routes>
  )
}

export default App