import React, { useState} from "react";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const faqData = [
  {
    question: "How do I donate an item?",
    answer:
      "Go to the Donate page, fill in the product details, upload an image, and click Submit. Your item will be listed for others.",
  },
  {
    question: "How can I buy an item?",
    answer:
      "Visit the Buy page, browse available items, and click on a product to see details. You can then contact the donor.",
  },
  {
    question: "Is LoopUp free to use?",
    answer:
      "Yes! LoopUp is completely free. Our mission is to encourage reusing and exchanging items for social good.",
  },
  {
    question: "How do I update my profile?",
    answer:
      "Navigate to the Profile section, click Edit, update your details, and Save. Changes are reflected instantly.",
  },
];




const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
    useDocumentTitle("LoopUp - FAQs");

  
  window.scrollTo(0, 0);

  return (
    <div className="min-h-screen flex bg-gray-50 mt-20">
      {/* Sidebar */}
      <div className="w-1/3 md:w-1/4 bg-teal-600 text-white p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">FAQs</h2>
        {faqData.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`block w-full text-left px-3 py-2 rounded-lg transition ${
              activeIndex === index
                ? "bg-yellow-400 text-gray-900 font-semibold"
                : "hover:bg-blue-500"
            }`}
          >
            {item.question}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          {faqData[activeIndex].question}
        </h3>
        <p className="text-lg text-gray-700">
          {faqData[activeIndex].answer}
        </p>
      </div>
    </div>
  );
};

export default FAQPage;
