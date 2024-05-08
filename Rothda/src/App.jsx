import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthProvvider } from "./context/AuthContext"

import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage"
import TaskPage from "./pages/TaskPage"
import TaskFormPage from "./pages/TaskFormPage"
import Profilepage from "./pages/Profilepage"
import HomePage from "./pages/HomePage"
import ProtectedRoute from "./ProtectedRoute"
import { TaskProvider } from "./context/TasksContext"
import { Navbar } from "./components/Navbar"
import TaskViewPage from "./pages/TaskViewPage"
import Footer from "./components/Footer"
import TaskFormPageEdit from "./pages/TaskFormPageEdit"

function App() {
  return(
    <AuthProvvider>
      <TaskProvider>
      <BrowserRouter>
      <main className="container mx-auto">
      <Navbar/>
      <Routes>
          <Route path='/' element={<HomePage/>} />
          <Route path='/login' element={<LoginPage/>} />
          <Route path='/register' element={<RegisterPage/>} />
          
          
          <Route element={<ProtectedRoute/>}>
          <Route path='/add-task' element={<TaskFormPage/>} />
          <Route path='/task' element={<TaskPage/>}/>
          <Route path='/view/task/:id/' element={<TaskViewPage/>} /> {/* Ruta para ver */}
          <Route path="/edit-task/:id" element={<TaskFormPageEdit />} />
          <Route path='/profile' element={<Profilepage/>} />
          </Route>
      </Routes>
      <Footer/>
      </main>
    </BrowserRouter>
      </TaskProvider>
    </AuthProvvider>

  )
  
}

export default App