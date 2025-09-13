import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase/firebase";
import { toast } from "react-toastify";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
  getDocs,
} from "firebase/firestore";

import { ref, deleteObject } from "firebase/storage";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function MyDonationsPage() {
  const [products, setProducts] = useState([]);
  const [productRequests, setProductRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("donations"); // 👈 for mobile tab switch

  const user = auth.currentUser;
  useDocumentTitle("My Donations");

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "posts"), where("userId", "==", user.uid));
    const qRequests = query(
      collection(db, "interestedForms"),
      where("giverId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const unsubscribeRequests = onSnapshot(qRequests, (snapshot) => {
        const requests = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductRequests(requests);
      });

      setProducts(items);
    });

    return () => unsubscribe();
  }, [user]);

  // ✅ Delete product (and image from storage)
  const handleDelete = async (product) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteDoc(doc(db, "posts", product.id));

      const q = query(
        collection(db, "interestedForms"),
        where("itemId", "==", product.id)
      );
      const snapshot = await getDocs(q);

      const deletePromises = snapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, "interestedForms", docSnap.id))
      );
      await Promise.all(deletePromises);

      if (product.imageUrl) {
        const imageRef = ref(storage, product.imageUrl);
        await deleteObject(imageRef).catch(() =>
          console.warn("Image not found in storage")
        );
      }
      toast.warn("Item deleted Succesfully", { theme: "colored" });
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  const handleUpdate = async (id) => {
    const newTitle = prompt("Enter new title:");
    if (!newTitle) return;
    try {
      await updateDoc(doc(db, "posts", id), { title: newTitle });
      toast.success("Product Updated Succesfully", { theme: "colored" });
    } catch (err) {
      console.error("Error updating:", err);
    }
  };

  const handleundoSold = async (id) => {
    try {
      await updateDoc(doc(db, "posts", id), { sold: false });
      toast.success("Marked as Available", { theme: "colored" });
    } catch (err) {
      console.error("Error marking as available:", err);
    }
  };

  const handleMarkSold = async (id) => {
    try {
      await updateDoc(doc(db, "posts", id), { sold: true });
      toast.info("Marked as Sold", { theme: "colored" });
    } catch (err) {
      console.error("Error marking as sold:", err);
    }
  };

  const getProductTitle = (productId) => {
    const product = products?.find((p) => p.id === productId);
    return product?.title;
  };
  const getProductImage = (productId) => {
    const product = products?.find((p) => p.id === productId);
    return product?.imageUrl;
  };

  // ✅ My Donations Section
  const DonationsSection = () => (
    <div className="flex flex-col w-full mb-6">
      <h1 className="text-2xl font-bold mb-6">My Donations</h1>
      {products.length === 0 ? (
        <p>No donations yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg shadow bg-white overflow-hidden"
            >
              <img
                src={product.imageUrl}
                alt={product.title}
                className="h-28 w-full object-contain"
              />
              <div className="p-3">
                <h2 className="font-semibold text-sm">{product.title}</h2>
                <p className="text-xs text-gray-600">
                  {product.description || "No description"}
                </p>
                <p className="text-xs text-gray-500">📍 {product.location}</p>

                {product.sold ? (
                  <p className="text-green-600 font-bold text-xs mt-1">✅ Sold</p>
                ) : (
                  <button
                    onClick={() => handleMarkSold(product.id)}
                    className="mt-2 px-2 py-1 w-full bg-green-500 text-white rounded text-xs hover:bg-green-600"
                  >
                    Mark as Sold
                  </button>
                )}

                {product.sold && (
                  <button
                    onClick={() => handleundoSold(product.id)}
                    className="mt-2 px-2 py-1 w-full bg-teal-500 text-white rounded text-xs hover:bg-teal-600"
                  >
                    Undo Sold
                  </button>
                )}

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleUpdate(product.id)}
                    className="px-2 py-1 text-xs text-gray-600 border rounded hover:bg-gray-200"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="px-2 py-1 text-xs border text-black rounded hover:bg-red-400 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ✅ Interested People Section
  const InterestedSection = () => (
    <div className="flex flex-col w-full mb-6">
      <h1 className={`text-2xl font-bold mb-6 ${productRequests.length === 0 ? "hidden" : ""}`}>
        People Interested In Your Donations
      </h1>
     
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {productRequests?.map((request) => (
            <div
              key={request.id}
              className="border rounded-lg shadow bg-white overflow-hidden"
            >
              <div className="p-3 flex flex-col-reverse md:flex-row gap-2">
                <div className="text-xs">
                  <h2 className="font-semibold">
                    Product: {getProductTitle(request.itemId)}
                  </h2>
                  <p>Name: {request.name}</p>
                  <p>Email: {request.email}</p>
                  <p>Message: {request.purpose || "No message"}</p>
                </div>
                <img
                  src={getProductImage(request.itemId)}
                  alt=""
                  className="w-20 h-20 object-contain mx-auto"
                />
              </div>
            </div>
          ))}
        </div>
      
    </div>
  );

  return (
    <div className="p-4 mt-20">
      {/* ✅ Mobile Buttons */}
      <div className="flex md:hidden gap-2 mb-6">
        <button
          className={`flex-1 py-2 rounded ${
            activeTab === "donations"
              ? "bg-teal-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("donations")}
        >
          My Donations {products.length}
        </button>
        <button
          className={`flex-1 py-2 rounded ${
            activeTab === "interested"
              ? "bg-teal-600 text-white"
              : "bg-gray-200 text-gray-700"
          } ${productRequests.length === 0 && "hidden"}`}
          onClick={() => setActiveTab("interested")}
        >
          Interested People {productRequests.length}
        </button>
      </div>

      {/* ✅ Desktop → Two Column Grid */}
      <div className="hidden md:grid grid-cols-2 gap-6">
        <DonationsSection />
        <InterestedSection />
      </div>

      {/* ✅ Mobile → Conditional Rendering */}
      <div className="md:hidden">
        {activeTab === "donations" ? <DonationsSection /> : <InterestedSection />}
      </div>
    </div>
  );
}
