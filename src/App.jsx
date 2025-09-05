import React,{useEffect, useState} from 'react'
import Login from './pages/Login'
import SignupPage from './pages/SignupPage'
import Navbar from './components/navbar'
import Home from './pages/Home'
import DonatePage from './pages/Donate'
import Contact from './pages/Contact'
import Products from './pages/Products'
import Footer from './components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {login,logout,setInitialized} from './features/auth/authSlice'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {

 const dispatch = useDispatch();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log(currentUser);
        
        const { uid, email, displayName, photoURL } = currentUser;
        dispatch(login({ uid, email, displayName, photoURL }));
      } else {
        dispatch(logout());
      }
      dispatch(setInitialized(true));
    });
    return () => unsub();
  }, [dispatch]);

 const { user } = useSelector((s) => s.auth);
 console.log(user);
 
 

  return (<>
   
    <Router>
       
   { user && <Navbar/>} 
     
      <Routes>
      <Route path='/' element={user ? <Home/> : <Login /> } />
      <Route path='/login' element={ !user && <Login/>} />
      <Route path='/signup' element={!user && <SignupPage/> } />
      <Route path='/donate' element={user ? <DonatePage/> : <Login/> } />
      <Route path='/buy' element={user ? <Products/> : <Login />} />
      <Route path='/contact' element={user ? <Contact/> : <Login />} />
      </Routes>
     
        <Footer/> 
    
    </Router>
    
    
  </>
    
  )
}

export default App