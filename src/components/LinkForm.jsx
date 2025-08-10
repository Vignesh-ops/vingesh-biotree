import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addLink } from "../features/linkSlice";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import InputField from "./UI/InputField";

function LinkForm({ user }) {
  const dispatch = useDispatch();
  const [bioLinks, setBioLinks] = useState([]);
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch profile data
  useEffect(() => {
    if (!user?.uid) return;

    const fetchProfile = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          console.log("Fetched profile:", data);

          // Bio
          setBio(data.bio || "");

          // Links
          if (Array.isArray(data.bioLinks)) {
            const formatted = data.bioLinks.map((link) => ({
              key: link.id,
              id: link.id,
              url: link.url,
            }));
            setBioLinks(formatted);
          } else {
            setBioLinks([]);
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.uid]);

  // Update links
  const handleFieldChange = (index, field, newValue) => {
    setBioLinks((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: newValue,
      };
      return updated;
    });
  };

  // Add a new blank link
  const handleAddCustomField = () => {
    setBioLinks((prev) => [
      ...prev,
      { key: `custom-${Date.now()}`, id: "", url: "" },
    ]);
  };

  // Save to Firestore
  const saveUserProfile = async (uid, linksArr, bioText) => {
    const formattedLinks = linksArr.map((link) => ({
      id: link.id,
      url: link.url,
    }));

    await setDoc(
      doc(db, "users", uid),
      {
        bio: bioText,
        bioLinks: formattedLinks,
      },
      { merge: true }
    );
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validLinks = bioLinks.filter(
      (link) => link.id.trim() && link.url.trim()
    );

    if (validLinks.length === 0 && !bio.trim()) {
      setError("Please add at least a bio or one link");
      return;
    }

    try {
      await saveUserProfile(user.uid, validLinks, bio);

      validLinks.forEach((link) => {
        dispatch(addLink({ title: link.id, url: link.url }));
      });
    } catch (err) {
      console.error("Save failed:", err);
      setError("Failed to save profile");
    }
  };

  if (loading) {
    return <div className="text-white p-4">Loading profile...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-gray-800 p-6 rounded-lg border border-gray-700"
    >
      <h2 className="text-xl font-bold text-white mb-4">Edit Your Profile</h2>

      {error && (
        <p className="text-red-400 bg-red-900/30 p-2 rounded">{error}</p>
      )}

      {/* Bio Field */}
      <div>
        <label className="block text-white font-semibold mb-1">
          Your Bio
        </label>
        <textarea
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Tell something about yourself..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
        ></textarea>
      </div>

      {/* Links */}
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
