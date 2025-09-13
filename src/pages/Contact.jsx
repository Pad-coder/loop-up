import React, { useState } from "react";
import axios from "axios";
import { IoIosPin } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { toast } from "react-toastify"; // ✅ import toast

const Contact = () => {
  useDocumentTitle("Contact Us");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // ✅ for button loading
  const [submitted, setSubmitted] = useState(false); // ✅ for thank you msg

  const sendMessage = async (e) => {
    e.preventDefault();
    setLoading(true); // start loading
    try {
      const response = await axios.post(
       import.meta.env.VITE_APP_EMAILAPI,
        { name, email, message }
      );

      toast.success("Congratulations, We will reach you soon!");
      setSubmitted(true); // show thank you message
      setName("");
      setEmail("");
      setMessage("");
      return response.data;
    } catch (error) {
      if (error.response?.data?.message === "Invalid email address") {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message || "! Please fill all the fields.");
      }
    } finally {
      setLoading(false); // stop loading in all cases
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative top-15 lg:top-0 flex items-center justify-center p-6 ">
      <div className="bg-white shadow-lg rounded-2xl max-w-4xl w-full p-8">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Contact Us
        </h2>
        <p className="text-center text-gray-600 mb-8">
          We'd love to hear from you! Please fill out the form below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          {!submitted ? (
            <form className="flex flex-col space-y-4" onSubmit={sendMessage}>
              <input
                type="text"
                placeholder="Your Name"
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <textarea
                rows="5"
                placeholder="Your Message"
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
              <button
                type="submit"
                disabled={loading}
                className={`${
                  loading ? "bg-gray-400" : "bg-teal-600 hover:bg-teal-600/75"
                } text-white py-3 rounded-lg transition`}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6">
              <h3 className="text-2xl font-semibold text-green-600">
                ✅ Thank you for contacting us!
              </h3>
              <p className="text-gray-600 mt-2">
                We’ve received your message and will get back to you soon.
              </p>
            </div>
          )}

          {/* Contact Info */}
          <div className="flex flex-col justify-center space-y-4 text-gray-700">
            <div>
              <div className="flex items-center">
                <IoIosPin className="text-gray-600 size-6" />
                <h3 className="font-semibold text-lg ml-1">Address</h3>
              </div>
              <p>417, Chennai, India</p>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <FaPhoneAlt className="text-gray-600 size-5" />
                <h3 className="font-semibold text-lg">Phone</h3>
              </div>
              <p>+91 98765 43210</p>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <MdEmail className="text-gray-600 size-5" />
                <h3 className="font-semibold text-lg">Email</h3>
              </div>
              <p>support@loopup.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
