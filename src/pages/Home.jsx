import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
function Home() {
  const {user,status} = useSelector((state) => state.auth);

//   // When user data is still loading, show nothing or a loader
//  console.log('status',status)
//   if (status=='loading' || status=='pending' ) {
//     return (
//       <div className="max-w-6xl mx-auto p-6">
//         <div className="animate-pulse">
//         <div className="h-12 bg-gray-200 rounded w-1/3 mb-4"></div>
// <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
// <div className="h-48 bg-gray-200 rounded"></div>

//         </div>
//       </div>
//     );
//   }
//   // If profile is complete, redirect to bio
//   if (
//     user.username &&
//     user.theme &&
//     Array.isArray(user.bioLinks) &&
//     user.bioLinks.length > 0
//   ) {
//     return <Navigate to="/app/bio" replace />;
//   }

if (status === "loading") {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="animate-pulse">
        <div className="h-12 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="h-6 bg-gray-300 rounded w-2/3 mb-4"></div>
        <div className="h-48 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}



const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// Branding images (replace with your actual images)
const features = [
  {
    icon: "🌐",
    title: "Custom Domain",
    description: "Use your own domain or get a free .bio subdomain"
  },
  {
    icon: "🎨",
    title: "Beautiful Themes",
    description: "Multiple professionally designed themes to choose from"
  },
  {
    icon: "📊",
    title: "Analytics",
    description: "Track clicks and visitor statistics in real-time"
  },
  {
    icon: "🔗",
    title: "Unlimited Links",
    description: "Add as many links as you need to your bio page"
  }
];
  // Otherwise, show landing page
  return (
    <div>
      <Header />
       {/* Hero Section */}
       <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 transform rotate-6 scale-125 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Build Your Bio Page in Minutes �
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Create your personal bio link page and share all your content in one beautiful, mobile-friendly place.
            </p>
            <div className="mt-10 flex flex-col p-4 sm:flex-row justify-center gap-4 sm:gap-8">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/app/bio"
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                >
                  Get Started - It's Free
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/examples"
                  className="px-8 py-4 bg-white text-purple-600 border border-purple-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                >
                  See Examples
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brand Showcase */}
      <section className="bg-gray-50 py-12 hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 mb-8">Trusted by creators worldwide</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
            {[1, 2, 3, 4].map((i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex justify-center"
              >
                <div className="h-16 w-16 md:h-20 md:w-20 bg-white rounded-xl shadow-md flex items-center justify-center text-2xl">
                  {["🚀", "🎨", "🌟", "💎"][i-1]}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#cadae9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={item} className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in One Link
            </motion.h2>
            <motion.p variants={item} className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features to help you grow your audience and share your content.
            </motion.p>
          </motion.div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                variants={item}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="text-4xl mb-4 text-[#bb3351] ">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-500 to-pink-500 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to Boost Your Online Presence?</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Join thousands of creators who are using Vignesh.bio to share their content with the world.
            </p>
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                to="/app/bio"
                className="px-8 py-4 bg-white text-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
              >
                Create Your Bio Page Now
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Home;
