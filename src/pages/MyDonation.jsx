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
  const [activeTab, setActiveTab] = useState("donations");

  // ✅ Modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({
    action: null,
    payload: null,
    message: "",
  });

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
      setProducts(items);
    });

    const unsubscribeRequests = onSnapshot(qRequests, (snapshot) => {
      const requests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductRequests(requests);
    });

    return () => {
      unsubscribe();
      unsubscribeRequests();
    };
  }, [user]);

  // ✅ Delete product (and image from storage)
  const handleDelete = async (product) => {
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

  // ✅ Accept request
  const handleAccept = async ({ productId, itemId }) => {
    try {
      const docRef = doc(db, "interestedForms", productId);
      await updateDoc(docRef, {
        isAccepts: true,
        isRejects: false,
      });

      let totalItem = [];
      productRequests.forEach(
        (item) => item.itemId === itemId && totalItem.push(item)
      );

      toast.success(`Accepted${totalItem.length > 1 ? ", Please reject other pending requests." : ""}`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        }
      );
    } catch (err) {
      toast.error("Something went Wrong", { theme: "colored" });
    }
  };

  const handleRejects = async (productId) => {
    try {
      const docRef = doc(db, "interestedForms", productId);
      await updateDoc(docRef, {
        isAccepts: false,
        isRejects: true,
      });
      toast.success("Rejected", { theme: "colored" });
    } catch (error) {
      toast.error("Something went Wrong", { theme: "colored" });
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

  // ✅ Confirmation Modal Component
  const ConfirmModal = () =>
    confirmOpen && (
      <section className="fixed inset-0 bg-gray-400 opacity-95 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg w-80">
          <h2 className="text-lg font-semibold text-center">
            {confirmData.message}
          </h2>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => {
                confirmData.action(confirmData.payload);
                setConfirmOpen(false);
              }}
              className="px-4 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmOpen(false)}
              className="px-4 w-full py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </section>
    );

  // ✅ My Donations Section
  const DonationsSection = () => (
    <section className="flex flex-col w-full mb-6">
      <h1 className="text-2xl font-bold mb-6">My Donations</h1>
      {products.length === 0 ? (
        <p>No donations yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className=" rounded-lg shadow card-bordered border-gray-300 bg-white overflow-hidden"
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
                    className="px-2 py-1 w-full text-xs text-gray-600 border rounded hover:bg-gray-200"
                  >
                    Update
                  </button>
                  <button
                    onClick={() =>
                      setConfirmData({
                        action: handleDelete,
                        payload: product,
                        message: "Are you sure you want to delete this item?",
                      }) || setConfirmOpen(true)
                    }
                    className="px-2 py-1 w-full text-xs border text-black rounded hover:bg-red-400 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  // ✅ Interested People Section
  const InterestedSection = () => (
    <section className="flex flex-col w-full mb-6">
      <h1
        className={`text-2xl font-bold mb-6 ${
          productRequests.length === 0 ? "hidden" : ""
        }`}
      >
        People Interested In Your Donations
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {productRequests?.map((request) => (
          <div
            key={request.id}
            className="p-1 card card-bordered rounded-lg shadow bg-white overflow-hidden"
          >
            <div className="p-3 flex flex-col-reverse md:flex-row gap-2">
              <div className=" flex flex-col">
                <h2 className="font-semibold">
                  {getProductTitle(request.itemId)}
                </h2>

                <p>Name: {request.name}</p>
                <p>{request.email}</p>
                <p className="">Message:</p>
                <span className="italic text-blue-600">
                  "{request.purpose || "No message"}"
                </span>
              </div>
              <img
                src={getProductImage(request.itemId)}
                alt=""
                className="w-20 h-20 object-contain mx-auto"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {request.isAccepts ? (
                <button className="px-2 py-1 w-full text-xs text-gray-600 border rounded hover:bg-gray-200">
                  Accepted
                </button>
              ) : (
                <button
                  className="px-2 py-1 w-full text-xs text-gray-600 border rounded hover:bg-gray-200"
                  onClick={() =>
                    setConfirmData({
                      action: handleAccept,
                      payload: {
                        productId: request.id,
                        itemId: request.itemId,
                        person: request.name,
                      },
                      message: `Are you sure you want to give this item to ${request.name}?`,
                    }) || setConfirmOpen(true)
                  }
                >
                  Accept
                </button>
              )}
              {request.isRejects ? (
                <button className="px-2 py-1 w-full text-xs border text-black rounded hover:bg-red-400 hover:text-white">
                  Rejected
                </button>
              ) : (
                <button
                  className="px-2 py-1 w-full text-xs border text-black rounded hover:bg-red-400 hover:text-white"
                  onClick={() => handleRejects(request.id)}
                >
                  Reject
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <section className="p-4 mt-20">
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

      {/* ✅ Modal */}
      <ConfirmModal />
    </section>
  );
}
