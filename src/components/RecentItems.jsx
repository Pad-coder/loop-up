import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { formatDate } from '../hooks/useFormatedDate';
import { auth, db } from '../firebase/firebase';
import { fetchProducts, selectAllProducts } from '../features/products/productsSlice';
import { collection, getDocs, query, where } from "firebase/firestore";
import { FaRegThumbsUp } from "react-icons/fa";

function RecentItems() {
  const [userRequestedProduct, setUserRequestedProduct] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector(selectAllProducts);
  const user = auth.currentUser;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // ✅ Fetch user’s interested items
  useEffect(() => {
    const checkProduct = async () => {
      if (!user?.uid) return;

      try {
        const q = query(
          collection(db, "interestedForms"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const userDetail = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserRequestedProduct(userDetail);
      } catch (error) {
        console.error("Error checking product:", error);
      }
    };
    checkProduct();
  }, [user]);

  // Show only the 4 most recent
  const recentItems = products.slice(0, 4);

  const handleInterested = (productId) => {
    auth.currentUser
      ? navigate("/interested", {
          state: {
            itemId: productId,
            giverId: products.find((item) => item.id === productId)?.userId || "",
          },
        })
      : navigate("/login");
  };

  return (
    <section className="py-16 poppins-regular">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-body">Recently Available</h2>
          <Link to={"/freebie"} className="link-primary flex items-center gap-2">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {recentItems.length > 0 ? (
            recentItems.map((item) => (
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
                      {formatDate(item.createdAt)}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-light" style={{ borderTopWidth: '1px' }}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted">
                        by {item.donername === user?.displayName ? "You" : item.donername}
                      </span>

                      {/* ✅ Button logic same as Products page */}
                      {
                            userRequestedProduct.find(p => p.itemId === item.id) ? <button className={'px-3 py-1 rounded text-sm'} >
                              {item.sold ? "Not Available" : "Added to Interested "} {item.sold ? "" : <FaRegThumbsUp className="inline-block size-4" />}
                            </button> :
                              <button className={`${item.sold ? 'border border-red-500 p-1 rounded bg-gray-300 cursor-not-allowed' : 'text-teal-900 hover:bg-teal-600 border-1 border-teal-400 hover:text-white px-3 py-1 rounded '} ${item.userId === user?.uid ? "hidden" : ""}`} disabled={item.sold}
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
          ) : (
            <p className="text-muted">No recent items available</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default RecentItems;
