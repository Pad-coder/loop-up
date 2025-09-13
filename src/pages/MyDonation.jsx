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
  getDocs
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { useDocumentTitle } from "../hooks/useDocumentTitle";


export default function MyDonationsPage() {
  const [products, setProducts] = useState([]);
  const [productRequests, setProductRequests] = useState([]);



  const user = auth.currentUser;
  useDocumentTitle("My Donations");

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "posts"), where("userId", "==", user.uid));
    const qRequests = query(collection(db, "interestedForms"), where("giverId", "==", user.uid));

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
      }
      );

      setProducts(items);
    });

    return () => unsubscribe() && unsubscribeRequests();
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
      toast.warn("Item deleted Succesfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      })
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  // ✅ Update product details (example: title)
  const handleUpdate = async (id) => {
    const newTitle = prompt("Enter new title:");
    if (!newTitle) return;
    try {
      await updateDoc(doc(db, "posts", id), { title: newTitle });
      toast.success("Product Updated Succesfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } catch (err) {
      console.error("Error updating:", err);
    }
  };
  const handleundoSold = async (id) => {
    try {
      await updateDoc(doc(db, "posts", id), { sold: false });
      toast.success("Marked as Available", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
    catch (err) {
      console.error("Error marking as available:", err);
    }

  }
  // ✅ Mark as sold
  const handleMarkSold = async (id) => {
    try {
      await updateDoc(doc(db, "posts", id), { sold: true });
      toast.info("Marked as Sold", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      })
    } catch (err) {
      console.error("Error marking as sold:", err);
    }
  };

  const getProductTitle = (productId) => {
    const product = products?.find(p => p.id === productId);
    return product?.title;
  }
  const getProductImage = (productId) => {
    const product = products?.find(p => p.id === productId);
    return product?.imageUrl
  }
  return (
    <div className="p-8mt-20 grid grid-cols-2 gap-6 mt-20">
      <div className="flex flex-col  w-full mb-6">
        <h1 className="text-2xl font-bold mb-6">My Donations</h1>

        {products.length === 0 ? (
          <p>No donations yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg shadow bg-white overflow-hidden"
              >
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="h-40 w-full object-cover"
                />
                <div className="p-4">
                  <h2 className="font-semibold">{product.title}</h2>
                  <p className="text-sm text-gray-600">
                    {product.description || "No description"}
                  </p>
                  <p className="text-sm text-gray-500">📍 {product.location}</p>

                  {product.sold ? (
                    <p className="text-green-600 font-bold mt-2">✅ Sold</p>
                  ) : (
                    <button
                      onClick={() => handleMarkSold(product.id)}
                      className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Mark as Sold
                    </button>
                  )}
                  {
                    product.sold ? (
                      <button
                        onClick={() => handleundoSold(product.id)}
                        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Undo Sold
                      </button>
                    ) : (''
                    )
                  }

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleUpdate(product.id)}
                      className="px-3 py-1  text-gray-600 border-2 rounded hover:bg-gray-200"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="px-3 py-1 border-2 hover:text-white text-black rounded hover:bg-red-400"
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
      {/* for display who wants this product */}
      <div className="flex flex-col w-full   mb-6">
        <h1 className="text-2xl font-bold mb-6">People Interested In Your Donations</h1>
        {productRequests.length === 0 ? (
          <p className="text-gray-600">This feature is coming soon...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {productRequests?.map((request) => (
              <div
                key={request.id}
                className="border rounded-lg shadow bg-white overflow-hidden" >
                <div className="p-4 flex flex-col-reverse lg:flex-row">
                  <div className="">
                    <h2 className="font-semibold">Product name: {getProductTitle(request.itemId)}</h2>
                    <p className="text-sm text-gray-600">Name: {request.name}</p>
                    <p className="text-sm text-gray-600">Email: {request.email}</p>

                    <p className="text-sm text-gray-600">Message: {request.purpose || "No message"}</p>
                  </div>
                  <img src={getProductImage(request.itemId)} alt="" className="w-30 h-35 relative left-5 object-contain" />

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
