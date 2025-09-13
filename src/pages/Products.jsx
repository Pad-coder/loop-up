import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth, db } from "../firebase/firebase";
import { fetchProducts, filterByCategory } from "./../features/products/productsSlice";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { MapPin, Clock } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query,where } from "firebase/firestore";
import { FaRegThumbsUp } from "react-icons/fa";
import {formatDate} from "../hooks/useFormatedDate";



const Products = () => {
  const [userRequestedProduct, setUserRequestedProduct] = useState([])
  const categories = ["all", "Clothes", "Books", "Electronics", "Furniture", "Others"];

  const dispatch = useDispatch();
  const productdata = useSelector((state) => state.product);

  const user = auth.currentUser;

 

useEffect(()=>{
const checkProduct = async (productId) => {
  
    if (!user?.uid) {
      console.warn("No user logged in yet, skipping product check");
      return;
    }
  try {
    // query 1: check by userId
    const q = query(
      collection(db, "interestedForms"),
      where("userId", "==", user.uid)
    );

   

    // run both queries
    const querysnapshot = await getDocs(q);
  

    // map results
    const userDetail = querysnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  
    
  setUserRequestedProduct(userDetail)
  } catch (error) {
    console.error("Error checking product:", error);
  }
};
checkProduct()
},[user])






  useEffect(() => {
    dispatch(fetchProducts()); // 🔹 Fetch from Firestore
  }, [dispatch]);

 
  const navigate = useNavigate()

  const handleInterested = async (productId) => {
    const user = auth.currentUser;

    auth.currentUser ? navigate("/interested", { state: { itemId: productId, giverId: productdata.items.find(item => item.id === productId)?.userId || '' } }) : navigate("/login");
  };

  useDocumentTitle("Products");



  const renderMessage = () => {
    switch (
    productdata.items.length === 0 ? productdata.loading ? "loading" : productdata.error ? "error" : "items" : "items"
    ) {
      case "loading":
        return <div className="flex gap-10">
          <div className="flex w-52 flex-col gap-4">
            <div className="skeleton h-32 w-full bg-gray-400"></div>
            <div className="skeleton h-4 w-28 bg-gray-500"></div>
            <div className="skeleton h-4 w-full bg-gray-500"></div>
            <div className="skeleton h-4 w-full bg-gray-500"></div>
          </div>

          <div className="flex w-52 flex-col gap-4">
            <div className="skeleton h-32 w-full bg-gray-400"></div>
            <div className="skeleton h-4 w-28 bg-gray-500"></div>
            <div className="skeleton h-4 w-full bg-gray-500"></div>
            <div className="skeleton h-4 w-full bg-gray-500"></div>
          </div>

          <div className="flex w-52 flex-col gap-4">
            <div className="skeleton h-32 w-full bg-gray-400"></div>
            <div className="skeleton h-4 w-28 bg-gray-500"></div>
            <div className="skeleton h-4 w-full bg-gray-500"></div>
            <div className="skeleton h-4 w-full bg-gray-500"></div>
          </div>

          <div className="flex w-52 flex-col gap-4">
            <div className="skeleton h-32 w-full bg-gray-400"></div>
            <div className="skeleton h-4 w-28 bg-gray-500"></div>
            <div className="skeleton h-4 w-full bg-gray-500"></div>
            <div className="skeleton h-4 w-full bg-gray-500"></div>
          </div>

          <div className="flex w-52 flex-col gap-4">
            <div className="skeleton h-32 w-full bg-gray-400"></div>
            <div className="skeleton h-4 w-28 bg-gray-500"></div>
            <div className="skeleton h-4 w-full bg-gray-500"></div>
            <div className="skeleton h-4 w-full bg-gray-500"></div>
          </div>

        </div>
      case "items":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 poppins-regular">
            {
              productdata.filteredItems.length === 0 ?
              <div className="text-center "> 
              <p className="text-center text-gray-500 col-span-full py-10">
                No items found in this category.
              </p>
              </div> :
              productdata.filteredItems.map((item) => (
              <div key={item.id} className="product-card rounded-lg overflow-hidden cursor-pointer">
                <div className="relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className={`w-full h-48 object-contain ${item.sold ? 'grayscale' : ''}`}
                  />
                  <div className="absolute top-2 right-2 bg-success text-inverse px-2 py-1 rounded text-sm">
                    FREE
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-body mb-2">{item.title}</h3>
                  <p className="text-muted mb-4 text-sm">{item.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted">
                      <MapPin size={14} />
                      {item.location}
                    </div>
                    <div className="flex items-center gap-1 text-muted">
                      <Clock size={14} />
                      {formatDate(item.createdAt)
                      }
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-light" style={{ borderTopWidth: '1px' }}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted">by {item.donername === user?.displayName ? "You" : item.donername} </span>
                      {
                        userRequestedProduct.find(p => p.itemId === item.id) ? <button className={'px-3 py-1 rounded text-sm'} >
                        { "Added to Interested "} <FaRegThumbsUp className="inline-block size-4" />
                      </button> :
                         <button className={`${item.sold ? 'border border-red-500 p-1 rounded bg-gray-300 cursor-not-allowed' : 'btn-outline-primary px-3 py-1 rounded text-sm'} ${item.userId === user?.uid ? "hidden" : ""}`} disabled={item.sold}
                        onClick={() => { handleInterested(item.id) }}
                      >
                        {item.sold ? "Item gone" : "I'm Interested"}
                      </button>
                      }
                     
                    </div>
                  </div>
                </div>
              </div>
            ))
            }
          </div>
        );
      case "error":
        return <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="text-center p-8 bg-white shadow-lg rounded-2xl">
            <h1 className="text-9xl font-extrabold text-red-500">404</h1>
            <p className="text-2xl font-semibold mt-4 text-gray-700">Page Not Found</p>
            <p className="mt-2 text-gray-500">
              Oops! The page you are looking for doesn’t exist.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
            >
              Go Back Home
            </button>
          </div>
        </div>

      default:
        return <p>Unknown status.</p>;
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto mt-20">
      {/* Category Filter */}
      <div className="flex justify-end gap-2 mb-4 overflow-hidden">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => dispatch(filterByCategory(cat))}
            className="px-4 py-2 w-20 lg:w-36 text-center text-[12px] h-10 rounded bg-gray-200 hover:bg-gray-300"
          >
            {cat}
          </button>
        ))}
      </div>

      {renderMessage()}
    </div>
  );
};

export default Products;
