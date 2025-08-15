import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { addLink } from "../features/linkSlice";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Plus, Save, Trash2, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function LinkForm({ user }) {
  const dispatch = useDispatch();
  const [bioLinks, setBioLinks] = useState([]);
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  // URL validation helper
  const isValidUrl = useCallback((string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }, []);

  // Memoized validation
  const isValidForm = useMemo(() => {
    const hasValidLinks = bioLinks.some(link => 
      link.id.trim() && link.url.trim() && isValidUrl(link.url.trim())
    );
    return bio.trim() && hasValidLinks;
  }, [bio, bioLinks, isValidUrl]);

  // Fetch profile data
  useEffect(() => {
    if (!user?.uid) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileRef = doc(db, "users", user.uid, "profile", "info");
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const data = profileSnap.data();
          setBio(data.bio || "");

          if (Array.isArray(data.bioLinks)) {
            const formatted = data.bioLinks.map((link, index) => ({
              key: link.id || `link-${index}`,
              id: link.id || "",
              url: link.url || "",
              error: ""
            }));
            setBioLinks(formatted);
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.uid]);

  // Debounced auto-save
  useEffect(() => {
    if (!loading && isValidForm) {
      const timer = setTimeout(() => {
        handleSave(true); // silent save
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [bio, bioLinks, loading, isValidForm]);

  // Handle field changes with validation
  const handleFieldChange = useCallback((index, field, newValue) => {
    setBioLinks(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: newValue,
        error: field === 'url' && newValue && !isValidUrl(newValue) ? 'Invalid URL' : ''
      };
      return updated;
    });
  }, [isValidUrl]);

  // Add new link
  const handleAddCustomField = useCallback(() => {
    setBioLinks(prev => [
      ...prev,
      { key: `custom-${Date.now()}`, id: "", url: "", error: "" }
    ]);
  }, []);

  // Remove link
  const handleRemoveLink = useCallback((index) => {
    setBioLinks(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Native drag and drop implementation
  const handleDragStart = useCallback((e, index) => {
    e.dataTransfer.setData('text/plain', index.toString());
    setDraggedItem(index);
    e.currentTarget.style.opacity = '0.4';
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e, index) => {
    e.preventDefault();
    const draggedIndex = Number(e.dataTransfer.getData('text/plain'));
    if (draggedIndex === index) return;

    setBioLinks(prev => {
      const newLinks = [...prev];
      const [removed] = newLinks.splice(draggedIndex, 1);
      newLinks.splice(index, 0, removed);
      return newLinks;
    });
  }, []);

  const handleDragEnd = useCallback((e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedItem(null);
  }, []);

  // Save profile
  const handleSave = useCallback(async (silent = false) => {
    if (!isValidForm) {
      if (!silent) setError("Please add a bio and at least one valid link");
      return;
    }

    const validLinks = bioLinks.filter(
      link => link.id.trim() && link.url.trim() && isValidUrl(link.url.trim())
    );

    try {
      setSaving(true);
      setError("");

      const profileRef = doc(db, "users", user.uid, "profile", "info");
      await setDoc(profileRef, {
        bio: bio.trim(),
        bioLinks: validLinks.map(link => ({
          id: link.id.trim(),
          url: link.url.trim()
        }))
      }, { merge: true });

      if (!silent) {
        setSuccess("Profile saved successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }

      // Dispatch links to Redux store
      validLinks.forEach(link => {
        dispatch(addLink({ title: link.id, url: link.url }));
      });

    } catch (err) {
      console.error("Save failed:", err);
      if (!silent) setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [bio, bioLinks, user?.uid, dispatch, isValidForm, isValidUrl]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
          <div className="h-20 bg-gray-300 rounded mb-4"></div>
          <div className="h-10 bg-gray-300 rounded mb-2"></div>
          <div className="h-10 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      <AnimatePresence>
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-lg border ${
              error 
                ? 'bg-red-50 border-red-200 text-red-700' 
                : 'bg-green-50 border-green-200 text-green-700'
            }`}
          >
            {error || success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bio Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <label className="block text-sm font-semibold text-gray-700">
          Your Bio *
        </label>
        <textarea
          className="w-full p-4 text-gray-700 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
          placeholder="Tell your visitors about yourself... (required)"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          maxLength={500}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>A compelling bio helps visitors connect with you</span>
          <span>{bio.length}/500</span>
        </div>
      </motion.div>

      {/* Links Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-gray-700">
            Your Links * (Drag to reorder)
          </label>
          <button
            type="button"
            onClick={handleAddCustomField}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add Link
          </button>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {bioLinks.map((link, index) => (
              <motion.div
                key={link.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  backgroundColor: draggedItem === index ? 'rgba(236, 253, 245, 0.5)' : 'rgba(249, 250, 251, 1)'
                }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 p-4 rounded-lg border-2 transition-all ${
                  draggedItem === index 
                    ? 'border-emerald-300 shadow-lg' 
                    : 'border-transparent hover:border-gray-200'
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
              >
                <div
                  className="flex items-center text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                >
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <circle cx="9" cy="12" r="1"></circle>
                    <circle cx="9" cy="5" r="1"></circle>
                    <circle cx="9" cy="19" r="1"></circle>
                    <circle cx="15" cy="12" r="1"></circle>
                    <circle cx="15" cy="5" r="1"></circle>
                    <circle cx="15" cy="19" r="1"></circle>
                  </svg>
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Platform name (e.g., Instagram)"
                        value={link.id}
                        onChange={(e) => handleFieldChange(index, "id", e.target.value)}
                        className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="url"
                        placeholder="https://example.com/your-profile"
                        value={link.url}
                        onChange={(e) => handleFieldChange(index, "url", e.target.value)}
                        className={`w-full text-gray-700 px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          link.error ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                    </div>
                  </div>
                  
                  {link.error && (
                    <p className="text-sm text-red-600">{link.error}</p>
                  )}
                  
                  {link.url && isValidUrl(link.url) && (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-gray-700 gap-1 text-xs text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink size={12} />
                      Test link
                    </a>
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={() => handleRemoveLink(index)}
                  className="flex items-center justify-center w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {bioLinks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">No links added yet</p>
              <button
                onClick={handleAddCustomField}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Plus size={16} />
                Add Your First Link
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex gap-3 pt-4 border-t border-gray-200"
      >
        <button
          type="button"
          onClick={() => handleSave(false)}
          disabled={!isValidForm || saving}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            isValidForm && !saving
              ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        
        {bioLinks.length > 0 && (
          <div className="text-xs text-gray-500 flex items-center">
            Auto-saves after 3 seconds of inactivity
          </div>
        )}
      </motion.div>

      {/* Form Tips */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
      >
        <h4 className="font-medium text-blue-900 mb-2">💡 Pro Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use descriptive names for your links</li>
          <li>• Drag and drop to reorder your links by importance</li>
          <li>• Test your links to make sure they work correctly</li>
          <li>• Keep your bio concise but engaging</li>
        </ul>
      </motion.div>
    </div>
  );
}

export default LinkForm;