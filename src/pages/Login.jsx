import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
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
import { Section } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [error, setError] = useState("");
  const [showResetBtn, setShowResetBtn] = useState(false);

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
    setShowResetBtn(false);
    try {
      await applyPersistence();
      await signInWithEmailAndPassword(auth, email, password);
      navigate(`${location.pathname === "/login" ? "/" : location.pathname || "/"}`);
    } catch (e) {
      switch (e.code) {
        case "auth/invalid-credential":
          setError("Invalid email or password");
          setShowResetBtn(true); // ✅ Show reset button only for wrong credentials
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

  return (
    <section className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 grid gap-4">
        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Remember Me */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe((v) => !v)}
          />
          Remember Me
        </label>

        {/* Error Message */}
        {error && <div className="text-sm text-red-600">{error}</div>}

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleSignup}
            className="bg-purple-600 w-full text-white py-2 rounded hover:bg-purple-700 transition"
          >
            Sign up
          </button>
          <button
            onClick={handleLogin}
            className="bg-teal-600 w-full text-white py-2 rounded hover:bg-teal-700 transition"
          >
            Log in
          </button>
        </div>

        {/* Show Forgot Password only if wrong login */}
        {showResetBtn && (
          <button
            onClick={handleForgotPassword}
            className="bg-gray-700 text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Forgot Password
          </button>
        )}

        {resetMessage && <div className="text-sm text-blue-700">{resetMessage}</div>}

        <div className="h-px bg-gray-200 my-2" />

        {/* Google Login */}
        <button
          className="flex items-center justify-center gap-2 bg-white py-2 border rounded hover:bg-gray-50 transition"
          onClick={handleGoogleLogin}
        >
          <svg
            aria-label="Google logo"
            width="24"
            height="24"
            viewBox="0 0 512 512"
          >
            <path fill="#4285f4" d="M386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
            <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
            <path fill="#fbbc02" d="M90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
            <path fill="#ea4335" d="M153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
          </svg>
          Login with Google
        </button>
      </div>
    </section>
  );
}

export default Login;
