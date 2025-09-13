import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { collection, query, where, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore";

const RequestedProducts = () => {
  const [reqProducts, setReqProducts] = useState([]);
  const currentUser = auth.currentUser;


  
  useEffect(() => {
    const fetchRequestedProducts = async () => {
      if (!currentUser) return;

      try {
        // Step 1: Get all requests for this user
        const q = query(
          collection(db, "interestedForms"),
          where("userId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);

        const requests = querySnapshot.docs.map((docSnap) => ({
          requestId: docSnap.id,
          ...docSnap.data(),
        }));

        // Step 2: Fetch product details for each request
        const productsData = await Promise.all(
          requests.map(async (req) => {
            const productRef = doc(db, "posts", req.itemId);
            const productSnap = await getDoc(productRef);
            if (productSnap.exists()) {
              return {
                requestId: req.requestId,
                purpose: req.purpose, 
                ...productSnap.data(),
              };
            }
            return null;
          })
        );

        setReqProducts(productsData.filter(Boolean)); 
      } catch (error) {
        console.error("Error fetching requested products:", error);
      }
    };

    fetchRequestedProducts();
  }, [currentUser]);

  // Undo Request
  const handleUndoRequest = async (requestId) => {
    try {
      await deleteDoc(doc(db, "interestedForms", requestId));
      setReqProducts((prev) => prev.filter((p) => p.requestId !== requestId));
    } catch (error) {
      console.error("Error undoing request:", error);
    }
  };

  return (
    <div className="p-6 mt-20">
      {reqProducts.length !== 0 && <h2 className="text-2xl font-bold mb-4">Your Requested Products</h2>}

      {reqProducts.length === 0 ? (
        <div className="min-h-screen flex justify-center  ">
            <h2 className="text-gray-600 text-2xl">No requested products found.</h2>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reqProducts.map((product) => (
            <div
              key={product.requestId}
              className="border rounded-2xl p-4 shadow-md bg-white"
            >
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-40 object-contain rounded-xl mb-3"
                />
              )}
              <h3 className="text-lg font-semibold">{product.title}</h3>
              <p className="text-sm text-gray-600">{product.description}</p>
              <p className="text-sm text-gray-600">Donner name : {product.donername}</p>
              <p className="text-sm text-gray-600">Location : {product.location}</p>

              {product.purpose && (
                <p className="text-sm italic text-blue-600 mt-1">
                  Your note: "{product.purpose}"
                </p>
              )}

              <button
                onClick={() => handleUndoRequest(product.requestId)}
                className="mt-3 bg-teal-600 hover:bg-teal-800 text-white px-4 py-2 rounded-lg"
              >
                Undo Request
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestedProducts;
