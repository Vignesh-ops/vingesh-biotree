// src/components/LinkForm.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLink } from "../features/linkSlice";
import { db } from "../firebase";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";

function LinkForm() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [error, setError] = useState("");
  
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);



  const saveUserProfile = async (uid, uname, socials) => {
    await setDoc(doc(db, "users", uid), {
      username: uname,
      ...socials
    }, { merge: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !url || !username || !user) {
      setError("Please fill all required fields.");
      return;
    }

 

    await saveUserProfile(user.uid, {
      instagram, facebook, linkedin, twitter
    });

    dispatch(addLink({ title, url }));
    
    setTitle("");
    setUrl("");
    setError("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 bg-white/10 backdrop-blur-lg shadow-lg p-4 rounded-xl border border-white/20"
    >
      {error && <p className="text-red-400">{error}</p>}
     
      <input
        type="text"
        placeholder="Link Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="bg-white/5 text-white p-3 rounded-lg w-full"
        autoComplete="true"
      />
      <input
        type="url"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="bg-white/5 text-white p-3 rounded-lg w-full"
      />
      <input
        type="url"
        placeholder="Instagram URL"
        value={instagram}
        onChange={(e) => setInstagram(e.target.value)}
        className="bg-white/5 text-white p-3 rounded-lg w-full"
      />
      <input
        type="url"
        placeholder="Facebook URL"
        value={facebook}
        onChange={(e) => setFacebook(e.target.value)}
        className="bg-white/5 text-white p-3 rounded-lg w-full"
      />
      <input
        type="url"
        placeholder="LinkedIn URL"
        value={linkedin}
        onChange={(e) => setLinkedin(e.target.value)}
        className="bg-white/5 text-white p-3 rounded-lg w-full"
      />
      <input
        type="url"
        placeholder="Twitter URL"
        value={twitter}
        onChange={(e) => setTwitter(e.target.value)}
        className="bg-white/5 text-white p-3 rounded-lg w-full"
      />
      <button
        type="submit"
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-4 py-3 rounded-lg w-full shadow-md"
      >
        ➕ Save & Add Link
      </button>
    </form>
  );
}

export default LinkForm;
