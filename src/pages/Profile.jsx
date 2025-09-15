import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { toast } from "react-toastify";


const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const user = auth.currentUser;

  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");



  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {

    try {
      if (name !== user.displayName) {
        await updateProfile(user, { displayName: name });
      }
      if (email !== user.email) {
        await updateEmail(user, email);
      }
      if (password) {
        await updatePassword(user, password);
      }

      toast.success("✅ Profile updated!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      })
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);

      toast.error("⚠️ " + err.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      })
    }
  };

  const handleLogout = () => {
    console.log("User logged out");
  };

  return (
    <section className="min-h-screen flex flex-col md:flex-row bg-gray-100 mt-20">
      {/* Sidebar */}
      <div className="lg:w-1/4 bg-white shadow-md flex flex-col justify-between p-6">
        <div className="mb-6 flex flex-col-reverse lg:block">
          <div className="pb-4 border-b-2 grid grid-cols-3  border-b-gray-700 mb-4">
            <img src={user.photoURL || "https://as2.ftcdn.net/v2/jpg/02/08/98/17/1000_F_208981748_9fbrA3Hy2GGajHn4XDtfzVFMzHiXguYg.jpg"} className="rounded-full w-18 h-18 col-span-1 " alt="" />
            <div className="col-span-2 ">
              <h3 className="text-3xl font-thin">Hello !</h3>
              <h2 className="text-2xl font-semibold">{name ? name : "User"}</h2>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="hidden md:inline-block px-4 py-2 w-30 bg-red-500 text-white rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white shadow-md m-6 p-6 rounded-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 lg:w-1/2 ">
          <h2 className="text-xl font-bold">Personal Details</h2>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="px-4 py-1 bg-blue-500 text-white rounded-lg"
            >
              Edit
            </button>
          )}
        </div>

        {/* Form */}
        <div className="space-y-4 lg:w-1/2">
          <input
            type="text"
            name="name"
            value={name}
            disabled={!isEditing}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-3 border rounded-lg ${isEditing ? "border-blue-400" : "bg-gray-100"
              }`}
            placeholder="Name"
          />

          <input
            type="email"
            name="email"
            value={email}
            disabled={!isEditing}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-3 border rounded-lg ${isEditing ? "border-blue-400" : "bg-gray-100"
              }`}
            placeholder="Email"
          />



          <input
            type="password"
            name="password"
            value={password}
            disabled={!isEditing}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-3 border rounded-lg ${isEditing ? "border-blue-400" : "bg-gray-100"
              }`}
            placeholder="Password"
          />
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="mt-6">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-500 text-white rounded-lg"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfilePage;
