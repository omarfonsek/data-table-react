import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import PrimarySearchAppBar from './components/PrimarySearchAppBar'
import UsersPage from './app/page'

function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Bienvenido</h1>
      <p className="mb-4">Esta es la página principal.</p>
      <Link to="/users" className="text-blue-500 hover:underline">
        Ir a Usuarios
      </Link>
    </div>
  )
}

function App() {
  return (
    <>
      <PrimarySearchAppBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<UsersPage />} />
      </Routes>
    </>
  )
}

export default App
