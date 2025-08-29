import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, MapPin, Gift } from "lucide-react";
import { addProduct } from "../features/products/productsSlice";
import { useDispatch } from "react-redux";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function DonatePage() {
    const [product, setProduct] = useState([{
        title: "",
        description: "",
        category: "",
        location: "",
        image: null

    }]);
    const [preview, setPreview] = useState(null);

    const dispatch = useDispatch();



    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file); // blob URL
            setProduct({ ...product, image: imageUrl });
            setPreview(imageUrl);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(addProduct(product)); // just push new product into slice

        setProduct({ title: "", description: "", category: "", location: "", image: null });
        setPreview(null);
        alert("✅ Item added successfully!");
    };

    useDocumentTitle("Donate");

    return (<>
        <div className="min-h-screen mt-15 bg-gray-50">
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

                    <form className="space-y-5" >
                        {/* Item Title */}
                        <div>
                            <label className="block font-medium mb-1">Item Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Winter Jacket"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                                value={product.title}
                                onChange={(e) => setProduct({ ...product, title: e.target.value })}
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
                                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                            ></textarea>
                        </div>

                        {/* Category & Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-medium mb-1">Category</label>
                                <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                                    value={product.category}
                                    onChange={(e) => setProduct({ ...product, category: e.target.value })}>
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
                                        onChange={(e) => setProduct({ ...product, location: e.target.value })}
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
                                <input type="file" className="hidden" onChange={handleImageChange} />
                            </label>
                        </div>

                       
                    </form>
                </div>
            </section>

        </div>
        {/* Preview Section */}
        {
            preview && (
                <div className="p-6 border-t-2  rounded-lg shadow mt-6">
                    <h3 className="font-bold text-xl mb-2">Preview of your donation:</h3>
                    <div className="rounded-lg overflow-hidden  shadow bg-white">
                        <img
                            src={preview || "https://via.placeholder.com/400x300.png?text=Item+Image"}
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
                                onClick={handleSubmit}>
                                Add Item
                            </button>
                        </div>
                    </div>
                </div>
            )
        }
    </>
    );
}
