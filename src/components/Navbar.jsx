import React, { useState, useEffect } from "react";
import { Menu, X, Heart } from "lucide-react";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase.js";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { user } = useSelector((s) => s.auth);

  const handleLogout = async () => {
    await signOut(auth);
  };

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
      className={`w-full fixed top-0 poppins-regular bg-white/90 backdrop-blur-md shadow-md z-50 transition-transform duration-500 ${visible ? "translate-y-0" : "-translate-y-full"
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
          <Link to={`/`} className="hover:text-teal-600 transition">
            Home
          </Link>
          <Link to="/freebie" className="hover:text-teal-600 transition">
            Freebie
          </Link>
          <Link to="/donate" className="hover:text-teal-600 transition">
            Donate
          </Link>
          {/* Category with Dropdown */}
          {/* <details className="dropdown" >
            <summary className="btn border-0 hover:bg-inherit p-0 text-black font-light hover:text-teal-600 transition">Catagory</summary>
            <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
              <li><Link to="/category/electronics" className="block hover:text-teal-600">
                Electronics
              </Link></li>
              <li> <Link to="/category/furniture" className="block hover:text-teal-600">
                Furniture
              </Link></li>
              <li><Link to="/category/clothes" className="block hover:text-teal-600">
                Clothes
              </Link></li>
              <li>
                <Link to="/category/home_appliances" className="block hover:text-teal-600">Home Appliances</Link>
              </li>
            </ul>
          </details> */}


          <Link to="/contact" className="hover:text-teal-600 transition">
            Contact
          </Link>

          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn m-1"><CgProfile className="size-6" />{user ? user.displayName ? user.displayName : "User" : "Login"}</div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 gap-1.5 p-2 shadow-sm">
              <li><Link to={`/profile`}><CgProfile className="size-4" /> Profile</Link></li>
              <li><Link to={'/myDonation'}>My Donation</Link></li>
              <li>
                <Link to={'/reqestedproducts'}>My Requests</Link>
              </li>
              {user ? <li>
                <Link to="/login" className="px-2 py-2  bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                  onClick={handleLogout} > Log out </Link>
              </li>
                : <li><Link to={'/login'} className="px-2 py-2  bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">Login</Link></li>
              }
            </ul>
          </div>

        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center space-x-4">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn m-1"><CgProfile className="size-6" />{user ? user.displayName ? user.displayName : "User" : "Login"}</div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 gap-1.5 p-2 shadow-sm">
              <li><Link to={`/profile`}><CgProfile className="size-4" />Profile</Link></li>
              <li><Link to={'/myDonation'}>My Donation</Link></li>
              <li><Link to={'/reqestedproducts'}>My Requests</Link></li>
              {user ? <li>
                <Link to="/login" className="px-2 py-2  bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                  onClick={handleLogout} > Log out </Link>
              </li>
                : <li><Link to={'/login'} className="px-2 py-2  bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">Login</Link></li>
              }
            </ul>
          </div>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-6 space-y-2 text-gray-700 font-medium bg-white shadow-md">
          <Link to={`/`} className="block py-2 hover:text-teal-600 ">
            Home
          </Link>
          <Link to="/freebie" className="block py-2 hover:text-teal-600">
            Freebie
          </Link>
          <Link to="/donate" className="block py-2 hover:text-teal-600">
            Donate
          </Link>
          {/* Mobile Dropdown */}
          {/* <div>
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="w-full text-left py-2 flex items-center justify-between hover:text-teal-600"
            >
              <span>Catagory</span>
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
                <Link to="/category/clothes" className="block hover:text-teal-600">
                   Clothes
                </Link>
                <Link to="/category/home_appliances" className="block hover:text-teal-600">
                  Home Appliances
                </Link>
                
              </div>
            )}
          </div> */}


          <Link to="/contact" className="block py-2 hover:text-teal-600">
            Contact
          </Link>

        </div>
      )}
    </nav>
  );
};

export default Navbar;
