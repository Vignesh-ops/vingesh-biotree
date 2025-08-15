import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { 
  Sparkles, 
  Zap, 
  Shield, 
  TrendingUp, 
  Smartphone, 
  Palette,
  BarChart3,
  Globe,
  ArrowRight,
  Play,
  Star
} from "lucide-react";
import LoadingSpinner from "../components/UI/LoadingSpinner";

// Lazy load components for better performance
const AnimatedBackground = lazy(() => import("../components/UI/AnimatedBackground"));

function Home() {
  const { user, status } = useSelector((state) => state.auth);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  // Intersection Observer for animations
  const observeElement = useCallback((element, index) => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({ ...prev, [index]: true }));
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Redirect authenticated users with complete profiles
  if (status === "succeeded" && user) {
    const hasCompleteProfile = user.username && user.theme && user.bioLinks?.length > 0;
    if (hasCompleteProfile) {
      return <Navigate to="/app/bio" replace />;
    }
  }

  // Loading state with skeleton
  if (status === "loading") {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="animate-pulse space-y-8">
            <div className="text-center space-y-4">
              <div className="h-16 bg-gray-300 rounded w-3/4 mx-auto"></div>
              <div className="h-6 bg-gray-300 rounded w-2/3 mx-auto"></div>
              <div className="flex justify-center space-x-4">
                <div className="h-12 bg-gray-300 rounded w-32"></div>
                <div className="h-12 bg-gray-300 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const features = [
    {
      icon: Globe,
      title: "Custom Domain",
      description: "Use your own domain or get a free subdomain",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Palette,
      title: "Beautiful Themes",
      description: "6+ professionally designed themes to choose from",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Track clicks, views, and visitor engagement",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed and mobile performance",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Your data is protected with enterprise-grade security",
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Perfect experience on all devices and screen sizes",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Content Creator",
      content: "Linkbrew transformed how I share my content. The analytics help me understand my audience better!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616c24de9c1?w=150",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      role: "Small Business Owner",
      content: "The professional themes helped my business look more credible. Sales inquiries increased by 40%!",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      rating: 5
    },
    {
      name: "Jessica Park",
      role: "Musician",
      content: "Perfect for sharing my music across platforms. My fans love having everything in one place.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      rating: 5
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "50K+", label: "Links Shared" },
    { number: "99.9%", label: "Uptime" },
    { number: "150+", label: "Countries" }
  ];

  return (
    <div className="overflow-hidden">
      <Header />
      
      {/* Animated Background */}
      <Suspense fallback={null}>
        <AnimatedBackground />
      </Suspense>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-purple-700 text-sm font-medium mb-8"
            >
              <Sparkles size={16} />
              Join 10,000+ creators already using Linkbrew
            </motion.div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 bg-clip-text text-transparent">
                Your Digital Identity
              </span>
              <br />
              <span className="text-gray-900">All in One Link</span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Create a stunning bio page that showcases all your content, links, and personality. 
              Perfect for Instagram, TikTok, Twitter, and more.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link
                to={user ? "/app/bio" : "/login"}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg"
              >
                Get Started Free
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl shadow-lg hover:shadow-xl hover:border-purple-300 transition-all duration-300 font-semibold text-lg">
                <Play size={20} />
                Watch Demo
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 mt-1 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Shine Online</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to help you grow your audience and make meaningful connections.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 ${feature.bgColor} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Loved by <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Creators</span> Worldwide
            </h2>
            <p className="text-xl text-gray-600">See what our community has to say</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 lg:p-12 rounded-3xl text-center"
            >
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-2xl lg:text-3xl font-medium text-gray-900 mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              
              <div className="flex items-center justify-center space-x-4">
                <img
                  src={testimonials[currentTestimonial].avatar}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-lg">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-gray-600">
                    {testimonials[currentTestimonial].role}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Testimonial indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-purple-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl lg:text-2xl mb-10 text-purple-100 max-w-3xl mx-auto">
              Join thousands of creators who are already using Linkbrew to grow their online presence.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to={user ? "/app/bio" : "/login"}
                className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-bold text-lg"
              >
                Create Your Bio Page
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/examples"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl hover:bg-white/20 transition-all duration-300 font-bold text-lg"
              >
                View Examples
                <TrendingUp size={20} />
              </Link>
            </div>

            <p className="text-purple-200 text-sm mt-6">
              Free forever • No credit card required • Set up in 2 minutes
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;