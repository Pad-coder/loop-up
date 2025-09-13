import React, { useEffect } from 'react'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import DonatePage from './pages/Donate'
import PreviewPage from './pages/PreviewPage'
import SubmittedPage from './pages/SubmittedPage'
import Contact from './pages/Contact'
import Profile from './pages/Profile'
import MyDonation from './pages/MyDonation'
import Products from './pages/Products'
import Footer from './components/Footer'
import FAQPage from './pages/footer_links/Faq'
import InterestedForm from './pages/intrestedForm'
import RequestedProducts from './pages/requestedItem'

import { useDispatch, useSelector } from 'react-redux'
import { auth } from "./firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { login, logout, setInitialized } from './features/auth/authSlice'
import { Routes, Route } from 'react-router-dom';


function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {

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


  return (<>
    <Navbar />

    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={!user && <Login />} />
      <Route path='/donate' element={<DonatePage />} />
      <Route path='/preview' element={user ? <PreviewPage /> : <Login />} />
      <Route path='/submitted' element={user ? <SubmittedPage /> : <Login />} />
      <Route path='/freebie' element={<Products />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/profile' element={user ? <Profile /> : <Login />} />
      <Route path='/myDonation' element={user ? <MyDonation /> : <Login />} />
      <Route path='/interested' element={<InterestedForm />} />
      <Route path='/reqestedproducts' element={user? <RequestedProducts/> : <Login/>}/>
      <Route path='/faq' element={<FAQPage />} />
      <Route path='*' element={<h1 className='text-3xl min-h-screen font-bold text-center mt-20'>404 - Page Not Found</h1>} />
    </Routes>

    <Footer />
  </>

  )
}

export default App