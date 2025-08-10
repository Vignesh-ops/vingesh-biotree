import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
function Home() {
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
