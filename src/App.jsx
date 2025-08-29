import React,{useState} from 'react'
import Login from './pages/Login'
import Navbar from './components/navbar'
import Home from './pages/Home'
import DonatePage from './pages/Donate'
import Contact from './pages/Contact'
import Products from './pages/Products'
import Footer from './components/Footer'


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from "react-redux";

function App() {

const auth = useSelector((state) => state.auth);

  return (<>
   
    <Router>
       {
        auth.isAuthenticated && <Navbar /> 
       }
      <Routes>
      <Route path='/' element={auth.isAuthenticated ? <Home/> : <Login/>} />
      <Route path='/login' element={auth.isAuthenticated? <Home/> : <Login/>} />
      <Route path='/donate' element={auth.isAuthenticated ? <DonatePage/> : < Login/>} />
      <Route path='/buy' element={auth.isAuthenticated ? <Products/> : < Login/>} />
      <Route path='/contact' element={auth.isAuthenticated ? <Contact/> : < Login/>} />
      </Routes>
       {
        auth.isAuthenticated && <Footer/> 
       }
    </Router>
    
    
  </>
    
  )
}

export default App