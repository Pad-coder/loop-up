import React,{useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { auth } from "./../firebase/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
} from "firebase/auth";

import { useDocumentTitle } from "../hooks/useDocumentTitle";



function Login() {

   const { user } = useSelector((s) => s.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [error, setError] = useState("");
 
  useDocumentTitle("Login - LoopUp");

  const navigate = useNavigate();
   const applyPersistence = async () => {
    await setPersistence(
      auth,
      rememberMe ? browserLocalPersistence : browserSessionPersistence
    );
  };

  const handleSignup = async () => {
    setError("");
    try {
      await applyPersistence();
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (e) {
      setError(e.message);
    }
  };

  const handleLogin = async () => {
    setError("");
    try {
      await applyPersistence();
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (e) {
      setError(e.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await applyPersistence();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (e) {
      setError(e.message);
    }
  };

   const handleForgotPassword = async () => {
    setResetMessage("");
    if (!email) {
      setResetMessage("Please enter your email first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage("Password reset email sent! Check your inbox.");
    } catch (e) {
      setResetMessage("Error sending reset email: " + e.message);
    }
  };

  
  return (<>
<div className="min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-md rounded-2xl shadow p-6 grid gap-3">
       

       
         
            <input
              type="email"
              placeholder="Email"
              className="border rounded p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="border rounded p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe((v) => !v)}
              />
              Remember Me
            </label>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleSignup} className="bg-blue-600 text-white py-2 rounded">Sign up</button>
              <button onClick={handleLogin} className="bg-green-600 text-white py-2 rounded">Log in</button>
            </div>

            <button onClick={handleForgotPassword} className="bg-gray-700 text-white py-2 rounded">
              Forgot Password
            </button>
            {resetMessage && <div className="text-sm text-blue-700">{resetMessage}</div>}

            <div className="h-px bg-gray-200 my-2" />

            <button onClick={handleGoogleLogin} className="py-2 rounded border">
              Continue with Google
            </button>
        
      </div>
    </div>
  </>
  )
}

export default Login