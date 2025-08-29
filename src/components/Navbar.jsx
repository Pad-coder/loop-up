import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Heart } from "lucide-react";
import { logout } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [email,setEmail]=useState(1);

  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  }
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 300) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`w-full fixed top-0 bg-white/90 backdrop-blur-md shadow-md z-50 transition-transform duration-500 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Left Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Heart className="text-teal-600" size={28} />
          <h1 className="text-2xl md:text-3xl font-bold text-teal-700">
            Loop<span className="text-gray-800">Up</span>
          </h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 text-sm font-medium items-center">
          <Link to="/" className="hover:text-teal-600 transition">
            Home
          </Link>
          <Link to="/buy" className="hover:text-teal-600 transition">
            Buy
          </Link>
          <Link to="/donate" className="hover:text-teal-600 transition">
            Donate
          </Link>
          {/* Category with Dropdown */}
          <div className="relative group cursor-pointer">
            <div className="flex items-center gap-1 hover:text-teal-600 transition">
              <span>Products</span>
              <ChevronDown size={16} />
            </div>
            <div className="absolute top-6 left-0 w-44 bg-white shadow-lg rounded-lg p-2 hidden group-hover:block">
              <Link to="/category/electronics" className="block px-3 py-2 rounded hover:bg-gray-100">
                Electronics
              </Link>
              <Link to="/category/furniture" className="block px-3 py-2 rounded hover:bg-gray-100">
                Furniture
              </Link>
              <Link to="/category/fashion" className="block px-3 py-2 rounded hover:bg-gray-100">
                Fashion
              </Link>
              <Link to="/category/clothes" className="block px-3 py-2 rounded hover:bg-gray-100">
                Clothes
              </Link>
              <Link to="/category/babies" className="block px-3 py-2 rounded hover:bg-gray-100">
                Childrens
              </Link>
            </div>
          </div>

          
          <Link to="/contact" className="hover:text-teal-600 transition">
            Contact
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            onClick={handleLogout}
          >
           {email ? "Log out" : "Log in"}
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-6 space-y-2 text-gray-700 font-medium bg-white shadow-md">
          <Link to="/" className="block py-2 hover:text-teal-600">
            Home
          </Link>
          <Link to="/buy" className="block py-2 hover:text-teal-600">
            Buy
          </Link>
        <Link to="/donate" className="block py-2 hover:text-teal-600">
            Sell
          </Link>
          {/* Mobile Dropdown */}
          <div>
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="w-full text-left py-2 flex items-center justify-between hover:text-teal-600"
            >
              <span>Products</span>
              <ChevronDown
                size={16}
                className={`${categoryOpen ? "rotate-180" : ""} transition`}
              />
            </button>
            {categoryOpen && (
              <div className="pl-4 space-y-2">
                <Link to="/category/electronics" className="block hover:text-teal-600">
                  Electronics
                </Link>
                <Link to="/category/furniture" className="block hover:text-teal-600">
                  Furniture
                </Link>
                <Link to="/category/fashion" className="block hover:text-teal-600">
                  Fashion
                </Link>
                <Link to="/category/clothes" className="block hover:text-teal-600">
                  Clothes
                </Link>
                <Link to="/category/babies" className="block hover:text-teal-600">
                  Childrens
                </Link>
              </div>
            )}
          </div>

          
          <Link to="/contact" className="block py-2 hover:text-teal-600">
            Contact
          </Link>
          <Link
            to="/login"
            className="block py-2 bg-teal-600 text-white text-center rounded-lg hover:bg-teal-700"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
