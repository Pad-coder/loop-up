import React,{useEffect, useState} from 'react'

import { useDispatch,useSelector } from "react-redux";
import { login } from '../features/auth/authSlice';


function Login() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const dispatch = useDispatch();
  
  const handleLogin = (e) => {
    // Send email & password to authSlice
    e.preventDefault();
    if(!email || !password){
      alert("Please enter both email and password");
      return;
    }
    dispatch(login( email ));
  };

  return (<>
  <div className="hero bg-base-200 min-h-screen">
  <div className="hero-content flex-col lg:flex-row-reverse">
    <div className="text-center lg:text-left">
      <h1 className="text-5xl font-bold">Welcome back to LOOP UP</h1>
      <p className="py-6">
       Log in to continue your journey of giving and receiving.
      </p>
    </div>
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <fieldset className="fieldset">
          <label className="label">Email</label>
          <input type="email" className="input" placeholder="Email" value={email} onChange={(e)=> setEmail(()=> e.target.value)}  />
          <label className="label">Password</label>
          <input type="password" className="input" placeholder="Password" value={password} onChange={(e)=> setPassword(()=> e.target.value)} />
          <div><a className="link link-hover">Forgot password?</a></div>
          <button className="btn bg-teal-600 mt-4" onClick={handleLogin}>Login</button>
        </fieldset>
      </div>
    </div>
  </div>
</div>
  </>
  )
}

export default Login