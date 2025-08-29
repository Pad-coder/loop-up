import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts,filterByCategory } from "./../features/products/productsSlice";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const categories = ["all", "men's clothing", "jewelery", "electronics", "women's clothing"];
const Products = () => {
  const dispatch = useDispatch();
  const productdata  = useSelector((state) => state.product);


  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

useDocumentTitle("Products");

   const renderMessage = () => {
    switch (productdata.items.length === 0 ? (productdata.loading ? 'loading' : (productdata.error ? 'error' : 'items') ) : 'items') {
      case 'loading':
        return <p>Loading...</p>;
      case 'items':
        return  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {productdata.catagoryItems.map((item) => (
          <div key={item.id} className="p-4 border rounded shadow">
             <img
                src={item.image}
                alt={item.title}
                className="h-40 w-full object-contain mb-2"
              />
            <h2 className="font-semibold">{item.title}</h2>
            <p className="text-sm text-gray-600">{item.category}</p>
            <p><del>${item.price}</del> <span>Take it free</span></p>
          </div>
          ))}
        </div>
      case 'error':
        return <p>Something went wrong. Please try again.</p>;
      default:
        return <p>Unknown status.</p>;
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto mt-20">
      <div className="flex justify-end gap-2 mb-4 overflow-hidden ">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => dispatch(filterByCategory(cat ? cat : 'all'))}
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
