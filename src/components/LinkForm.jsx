import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addLink } from "../features/linkSlice";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import InputField from "./UI/InputField";

function LinkForm({ user }) {
  const dispatch = useDispatch();
  const [bioLinks, setBioLinks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchLinks = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          console.log("Fetched bioLinks:", data.bioLinks);

          if (Array.isArray(data.bioLinks)) {
            // Match the structure from SelectedBioitems
            const formatted = data.bioLinks.map(link => ({
              key: link.id, // Using platformId as key
              id: link.id,  // Platform ID (instagram, twitter, etc)
              url: link.url // The actual URL
            }));
            setBioLinks(formatted);
          } else {
            setBioLinks([]);
          }
        }
      } catch (err) {
        console.error("Error fetching links:", err);
        setError("Failed to load links");
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [user?.uid]);

  const handleFieldChange = (index, field, newValue) => {
    setBioLinks(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: newValue
      };
      return updated;
    });
  };

  const handleAddCustomField = () => {
    setBioLinks(prev => [...prev, { 
      key: `custom-${Date.now()}`, 
      id: "", 
      url: "" 
    }]);
  };

  const saveUserProfile = async (uid, linksArr) => {
    // Match the structure expected by SelectedBioitems
    const formattedLinks = linksArr.map(link => ({
      id: link.id,
      url: link.url
    }));

    await setDoc(
      doc(db, "users", uid), 
      { bioLinks: formattedLinks }, 
      { merge: true }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validLinks = bioLinks.filter(link => 
      link.id.trim() && link.url.trim()
    );

    if (validLinks.length === 0) {
      setError("Please add at least one valid link");
      return;
    }

    try {
      await saveUserProfile(user.uid, validLinks);
      
      // Dispatch to Redux if needed
      validLinks.forEach(link => {
        dispatch(addLink({ 
          title: link.id, 
          url: link.url 
        }));
      });

    } catch (err) {
      console.error("Save failed:", err);
      setError("Failed to save links");
    }
  };

  if (loading) {
    return <div className="text-white p-4">Loading links...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-gray-800 p-6 rounded-lg border border-gray-700"
    >
      <h2 className="text-xl font-bold text-white mb-4">Edit Your Links</h2>

      {error && (
        <p className="text-red-400 bg-red-900/30 p-2 rounded">
          {error}
        </p>
      )}

      {bioLinks.map((link, index) => (
        <div key={link.key || index} className="flex gap-3">
          <div className="flex-1">
            <InputField
              placeholder="Platform (instagram, twitter, etc)"
              value={link.id}
              onChange={(e) => handleFieldChange(index, "id", e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex-1">
            <InputField
              type="url"
              placeholder="https://example.com/username"
              value={link.url}
              onChange={(e) => handleFieldChange(index, "url", e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      ))}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={handleAddCustomField}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
        >
          + Add Link
        </button>
        
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

export default LinkForm;