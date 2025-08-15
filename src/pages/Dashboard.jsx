import { useDispatch, useSelector } from "react-redux";
import { fetchLinks, deleteLink } from "../features/linkSlice";
import { fetchUserProfile } from "../features/userSlice";
import { useEffect, useState, useMemo, useCallback } from "react";
import LinkForm from "../components/LinkForm";
import LinkCard from "../components/LinkCard";
import { useNavigate } from "react-router-dom";
import LoadingSpinner, { CardSkeleton } from "../components/UI/LoadingSpinner";
import { Copy, ExternalLink, Edit, Trash2, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Dashboard() {
  const dispatch = useDispatch();
  const { items: links, status: linksStatus } = useSelector(state => state.links);
  const { user, status: authStatus } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const [checkingProfile, setCheckingProfile] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');

  // Memoized profile URL
  const profileUrl = useMemo(() => 
    user?.username ? `${window.location.origin}/${user.username}` : '',
    [user?.username]
  );

  // Memoized profile completion check
  const isProfileComplete = useMemo(() => {
    if (!user) return false;
    return !!(
      user.username &&
      user.theme &&
      user.bio &&
      Array.isArray(user.bioLinks) &&
      user.bioLinks.length > 0
    );
  }, [user]);

  // Load data with error handling
  useEffect(() => {
    if (user?.uid) {
      const loadData = async () => {
        try {
          await Promise.all([
            dispatch(fetchUserProfile(user.uid)),
            dispatch(fetchLinks(user.uid))
          ]);
        } catch (error) {
          console.error("Failed to load dashboard data:", error);
        } finally {
          setCheckingProfile(false);
        }
      };
      loadData();
    }
  }, [user?.uid, dispatch]);

  // Redirect logic with better UX
  useEffect(() => {
    if (!checkingProfile && authStatus !== "loading" && linksStatus !== "loading" && user) {
      if (!isProfileComplete) {
        navigate("/app/setup", { replace: true });
      }
    }
  }, [checkingProfile, authStatus, linksStatus, user, navigate, isProfileComplete]);

  // Copy profile URL with feedback
  const handleCopyUrl = useCallback(async () => {
    if (!profileUrl) return;
    
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess('Failed to copy');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  }, [profileUrl]);

  // Delete link with confirmation
  const handleDeleteLink = useCallback(async (linkId) => {
    try {
      await dispatch(deleteLink(linkId));
      setShowDeleteModal(null);
    } catch (error) {
      console.error("Failed to delete link:", error);
    }
  }, [dispatch]);

  // Loading states
  if (checkingProfile || authStatus === "loading") {
    console.log('checkingProfile',checkingProfile,'authstatus',authStatus)
    return <LoadingSpinner fullScreen text="Loading your dashboard..." />;
  }

  if (!user) {
    return <LoadingSpinner fullScreen text="Please sign in to continue" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto p-4 space-y-8">
        
        {/* Dashboard Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user.displayName || user.username}! 👋
              </h1>
              <p className="text-gray-600">Manage your bio page and track your links</p>
            </div>
            
            {profileUrl && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCopyUrl}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Copy size={16} />
                  {copySuccess || 'Copy Link'}
                </button>
                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <ExternalLink size={16} />
                  View Profile
                </a>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Links</p>
                <p className="text-3xl font-bold text-gray-900">{user.bioLinks?.length || 0}</p>
              </div>
              <BarChart3 className="text-purple-500" size={32} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Profile Views</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <ExternalLink className="text-green-500" size={32} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Click Rate</p>
                <p className="text-3xl font-bold text-gray-900">0%</p>
              </div>
              <BarChart3 className="text-blue-500" size={32} />
            </div>
          </motion.div>
        </div>

        {/* Link Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Manage Your Links</h2>
            <p className="text-gray-600">Add, edit, or remove links from your bio page</p>
          </div>
          
          <div className="p-6">
            <LinkForm user={user} />
          </div>
        </motion.div>

        {/* Profile Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Preview</h2>
            <p className="text-gray-600">This is how your profile appears to visitors</p>
          </div>
          
          <div className="p-6">
            {linksStatus === "loading" ? (
              <CardSkeleton />
            ) : (
              user?.bioLinks && <LinkCard user={user} />
            )}
          </div>
        </motion.div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowDeleteModal(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 max-w-sm w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-4">Delete Link</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this link? This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(null)}
                    className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteLink(showDeleteModal)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default Dashboard;