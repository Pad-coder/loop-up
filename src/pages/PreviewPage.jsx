import React, { useState } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from 'react-toastify';
function PreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state || {};

  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    const { title, description, category, location: loc, file } = product;
    if (!title || !file) return alert("Title and image are required!");

    const user = auth.currentUser;
    if (!user) return alert("You must be logged in to upload!");

    setLoading(true); // ⏳ Start loading
    try {
      // File name with userId
      const fileName = `${user.uid}_${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `products/${fileName}`);

      // Upload file
      await uploadBytes(storageRef, file);

      // Get URL
      const downloadURL = await getDownloadURL(storageRef);

      // Save Firestore doc
      await addDoc(collection(db, "posts"), {
        title,
        description,
        category,
        location: loc,
        imageUrl: downloadURL,
        userId: user.uid,
        donername: user.displayName || "Anonymous",
        createdAt: serverTimestamp(),
      });
      // Redirect with state
      toast.success("Product added successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      })
      navigate("/submitted", {
        state: { title, description, category, location: loc, imageUrl: downloadURL },
      }); // redirect after success
    } catch (err) {
      console.error("Error uploading:", err);
    }
    finally {
      setLoading(false); // ✅ Stop loading in both success/failure
    }
  };



  return (<>
    <section className="p-6 border-t-2 border-gray-600  rounded-lg shadow mt-19">
      <h3 className="font-bold text-xl mb-2">Preview of your donation:</h3>
      <div className="rounded-lg overflow-hidden  shadow bg-white">
        <img
          src={product.preview || "https://placehold.net/400x600.png"}
          alt={"Item Preview"}
          className=" h-48 object-cover"
        />
        <div className="p-4">
          <h4 className="font-bold">{product.title || "Title"}</h4>
          <p className="text-sm text-gray-600">{product.description || "Description"}</p>
          <span className="text-sm text-gray-500">📍 {product.location || "Location"}</span>
        </div>
        <div className="bg-gray-100  " >

          <button className="m-4  bg-teal-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-teal-700 transition"
            onClick={handleUpload}>
            {loading ? <span className="loading loading-spinner"></span> : "Confirm & Upload"}
          </button>

        </div>
      </div>
    </section>
  </>
  )
}

export default PreviewPage