import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useEffect } from "react";

function Home() {
//   const {user,status} = useSelector((state) => state.auth);

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

  // Otherwise, show landing page
  return (
    <div>
      <Header />
      <section className="max-w-6xl mx-auto text-center py-20 px-4">
        <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Build Your Bio Page in Minutes 🚀
        </h1>
        <p className="mt-4 text-gray-600">
          Create your personal bio link page and share all your content in one place.
        </p>
        <Link
          to="/app/bio"
          className="mt-6 inline-block bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-purple-700 transition"
        > 
          Get Started
        </Link>
      </section>
      <Footer />
    </div>
  );
}

export default Home;
