import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPin } from 'lucide-react';

function SubmittedPage() {

  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state || {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 poppins-regular">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold text-teal-600 mb-4">
          Item Submitted Successfully!
        </h2>

        <img
          src={product.imageUrl || "https://placehold.co/400x400.png"}
          alt={product.title}
          className="w-40 h-40 mx-auto rounded-lg object-cover mb-4"
        />

        <h3 className="text-lg font-semibold">{product.title}</h3>
        <p className="text-sm text-gray-600">{product.description}</p>
        <p className="text-sm text-gray-500"><MapPin className="inline-block size-4 " /> {product.location}</p>
        <p className="text-sm text-gray-500">📂 {product.category}</p>

        <button
          onClick={() => navigate("/freebie")}
          className="mt-6 bg-teal-600 text-white px-6 py-2 rounded-lg shadow hover:bg-teal-700 transition"
        >
          View All Products
        </button>
      </div>
    </div>
  );
}

export default SubmittedPage;
