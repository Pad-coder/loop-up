import React from "react";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
const Contact = () => {
  useDocumentTitle("Contact Us");
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 ">
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
          <form className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              rows="5"
              placeholder="Your Message"
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <button
              type="submit"
              className="bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-600/75 transition"
            >
              Send Message
            </button>
          </form>

          {/* Contact Info */}
          <div className="flex flex-col justify-center space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-lg">📍 Address</h3>
              <p>123 Main Street, Chennai, India</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">📞 Phone</h3>
              <p>+91 98765 43210</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">📧 Email</h3>
              <p>support@loopup.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
