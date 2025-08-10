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

  // Fetch latest bioLinks directly from Firestore
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
            const formatted = data.bioLinks.map((link, idx) => ({
              key: link.key || `link-${idx}`,
              id: link.value?.id || "",
              url: link.value?.url || ""
            }));
            setBioLinks(formatted);
          } else {
            setBioLinks([]);
          }
        }
      } catch (err) {
        console.error("Error fetching links:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [user?.uid]);

  const handleFieldChange = (index, field, newValue) => {
    setBioLinks(prev => {
      const updated = [...prev];
      updated[index][field] = newValue;
      return updated;
    });
  };

  const handleAddCustomField = () => {
    setBioLinks(prev => [...prev, { key: Date.now().toString(), id: "", url: "" }]);
  };

  const saveUserProfile = async (uid, linksArr) => {
    const formattedLinks = linksArr.map(link => ({
      key: link.key,
      value: { id: link.id, url: link.url }
    }));

    await setDoc(doc(db, "users", uid), { bioLinks: formattedLinks }, { merge: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validLinks = bioLinks.filter(link => link.id && link.url);

    if (validLinks.length === 0) {
      setError("Please add at least one link.");
      return;
    }

    await saveUserProfile(user.uid, validLinks);

    validLinks.forEach(link => {
      dispatch(addLink({ title: link.id, url: link.url }));
    });

    setError("");
  };

  if (loading) {
    return <p className="text-white">Loading links...</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 bg-white/10 backdrop-blur-lg shadow-lg p-4 rounded-xl border border-white/20"
    >
      {error && <p className="text-red-400">{error}</p>}

      {bioLinks?.map((link, index) => (
        <div key={`${link.key}-${index}`} className="flex gap-2">
          <InputField
            placeholder="Platform ID (e.g., instagram)"
            value={link.id}
            onChange={(e) => handleFieldChange(index, "id", e.target.value)}
          />
          <InputField
            type="url"
            placeholder="https://example.com"
            value={link.url}
            onChange={(e) => handleFieldChange(index, "url", e.target.value)}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddCustomField}
        className="bg-blue-500 text-white px-3 py-2 rounded-md w-full"
      >
        ➕ Add Custom Field
      </button>

      <button
        type="submit"
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-4 py-3 rounded-lg w-full shadow-md"
      >
        Save Links
      </button>
    </form>
  );
}

export default LinkForm;
