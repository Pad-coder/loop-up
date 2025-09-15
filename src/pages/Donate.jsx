import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { motion } from "framer-motion";
import { Upload, MapPin, Gift } from "lucide-react";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { toast } from "react-toastify";

export default function DonatePage() {
  const [product, setProduct] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    donername: "",
    file: null,     // ✅ actual File object
    preview: null   // ✅ preview URL
  });

  const navigate = useNavigate();
  const user = auth.currentUser;
  
  
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
     
      user ? setProduct({ ...product, donername: user.displayName, file, preview: previewUrl }) : navigate('/login')
      !user && toast.warn("Please login to donate",{
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

  const handleSubmit = (e) => {
    e.preventDefault();
  user ? navigate("/preview", { state: product }) : navigate('/')
  };

  useDocumentTitle("Donate");

  return (
    <section className="min-h-screen mt-15 bg-gray-50 poppins-regular">
      {/* Hero Section */}
      <section className="relative bg-teal-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Donate & Make a Difference
          </motion.h1>
          <motion.p
            className="text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Share what you don’t need anymore with someone who does.
            Every donation brings us closer to a sustainable community.
          </motion.p>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-12">
        <div className="container mx-auto px-6 max-w-3xl bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Gift className="text-teal-500" /> Donate an Item
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Item Title */}
            <div>
              <label className="block font-medium mb-1">Item Title</label>
              <input
                type="text"
                placeholder="e.g. Winter Jacket"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                value={product.title}
                onChange={(e) =>
                  setProduct({ ...product, title: e.target.value })
                }
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea
                placeholder="Describe your item..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                value={product.description}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
              ></textarea>
            </div>

            {/* Category & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Category</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                  value={product.category}
                  onChange={(e) =>
                    setProduct({ ...product, category: e.target.value })
                  }
                >
                  <option value="">Select a category</option>
                  <option>Clothes</option>
                  <option>Books</option>
                  <option>Electronics</option>
                  <option>Furniture</option>
                  <option>Others</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Location</label>
                <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
                  <MapPin className="text-gray-500 mr-2" size={18} />
                  <input
                    type="text"
                    placeholder="City / Area"
                    className="flex-1 outline-none"
                    value={product.location}
                    onChange={(e) =>
                      setProduct({ ...product, location: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block font-medium mb-1">Upload Image</label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-teal-500">
                <Upload size={28} className="text-teal-500 mb-2" />
                <span className="text-gray-600">Click to upload</span>
                {product.preview && (
                  <img
                    src={product.preview}
                    alt="Preview"
                    className="mt-4 h-32 object-contain"
                  />
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <button
              className="m-4  bg-teal-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-teal-700 transition"
              type="submit"
            >
              Next
            </button>
          </form>
        </div>
      </section>
    </section>
  );
}
