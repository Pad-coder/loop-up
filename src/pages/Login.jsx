import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
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
import { useLocation } from "react-router-dom";


function Login() {

  const user = auth.currentUser;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [error, setError] = useState("");

  const location = useLocation();

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
     navigate(`${location.pathname === "/login" ? "/" : location.pathname || "/"}`);

    } catch (e) {
      switch (e.code) {
        case "auth/email-already-in-use":
          setError("Email already in use");
          break;
        case "auth/invalid-email":
          setError("Invalid email format");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters");
          break;
        case "auth/missing-password":
          setError("Password is required");
          break;
        default:
          setError(e.message);

      }

    }
  };

  const handleLogin = async () => {
    setError("");
    try {
      await applyPersistence();
      await signInWithEmailAndPassword(auth, email, password);
      navigate(`${location.pathname === "/login" ? "/" : location.pathname || "/"}`);


    } catch (e) {
      switch (e.code) {
        case "auth/invalid-credential":
          setError("Invalid email or password");
          break;
        case "auth/invalid-email":
          setError("Invalid email format");
          break;
        case "auth/missing-password":
          setError("Password is required");
          break;
        default:
          setError(e.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await applyPersistence();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
       navigate(`${location.pathname === "/login" ? "/" : location.pathname || "/"}`);


    } catch (e) {
      switch (e.code) {
        case "auth/invalid-credential":
          setError("Invalid credentials");
          break;
        case "auth/cancelled-popup-request":
          setError("Cancelled popup request");
          break;
        default:
          setError(e.message);
      }
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

        <div className="grid grid-cols-2 gap-10 mx-auto ">
          <button onClick={handleSignup} className="bg-purple-600 w-40 text-white py-2 rounded">Sign up</button>
          <button onClick={handleLogin} className="bg-teal-600 w-40 text-white py-2 rounded">Log in</button>
        </div>

        <button onClick={handleForgotPassword} className="bg-gray-700 text-white py-2 rounded">
          Forgot Password
        </button>
        {resetMessage && <div className="text-sm text-blue-700">{resetMessage}</div>}

        <div className="h-px bg-gray-200 my-2" />


        <button className="btn bg-white py-2 text-black border-[#e5e5e5]" onClick={handleGoogleLogin}>
          <svg aria-label="Google logo" width="35" height="35" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
          Login with Google
        </button>

      </div>
    </div>
  </>
  )
}

export default Login