import { motion } from "framer-motion";
import { Link } from 'react-router-dom'



export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden poppins-regular">
      {/* Background Slideshow */}
      <div className="absolute inset-0">
        <div className="w-full h-full animate-slide">

          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url(https://www.homelane.com/blog/wp-content/uploads/2018/12/shutterstock_779211907-1.jpg)`,
              objectFit: "cover",


            }}
          />

        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white px-4">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Welcome to <span className="text-teal-400">LoopUp</span>
        </motion.h1>
        <motion.p
          className="text-lg md:text-2xl mb-8 max-w-2xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Donate what you don’t need. Buy what you love. Together, let’s build a
          sustainable future.
        </motion.p>

        <div className="flex gap-4">
          <Link to="/donate">
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="px-6 py-2 bg-teal-500 w-30 text-white text-xl rounded-2xl shadow-lg hover:bg-teal-600 transition"
            >
              Donate
            </motion.button>
          </Link>
          <Link to="/freebie">
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="px-6 py-2 bg-white w-30 text-teal-600 text-xl  rounded-2xl shadow-lg hover:bg-gray-200 transition"
            >
              Freebie
            </motion.button>
          </Link>

        </div>
      </div>


    </section>
  );
}
