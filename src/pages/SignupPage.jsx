// src/pages/SignupPage.jsx
import React, { useState } from "react";


const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const user ={
    email:"dummyemail"
  }
  const handleSignup = (e) => {
    e.preventDefault();
   
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-xl font-bold mb-4">Signup</h2>
      <form onSubmit={handleSignup} className="flex flex-col gap-2 w-64">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn btn-primary text-white p-2 rounded">
          Signup
        </button>
      </form>
      {user && <p className="mt-4 text-green-600">Signed up as: {user.email}</p>}
    </div>
  );
};

export default SignupPage;
