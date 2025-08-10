import { useState } from 'react';
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from '../firebase'; // adjust this path as per your setup

function Setuserpath({ email, onUsernameSet, user }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState('');

  // Async function to check if username already exists in Firestore
  const checkUsernameExists = async (uname) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", uname));
    const snap = await getDocs(q);
    return !snap.empty;
  };

  // Save username & other socials (empty object here)
  const saveUserProfile = async (uid, uname, socials = {}) => {
    await setDoc(doc(db, "users", uid), {
      username: uname,
      ...socials
    }, { merge: true });
  };

  // This must be async because you await inside it
  const handleSubmit = async (e) => {
    e.preventDefault(); // stop page reload on submit

    // Basic validation
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    // Check if username already taken
    const exists = await checkUsernameExists(username);

    // Check if username is taken by someone else, allow if same user keeps it
    if (exists && username !== user.username) {
      setError("Username already taken. Please choose another.");
      return;
    }

    setError(""); // clear previous errors

    // Save username for this user
    try {
      await saveUserProfile(user.uid, username);
      onUsernameSet(username); // callback to parent component
    } catch (err) {
      setError("Failed to save username. Please try again.");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Welcome to Linkbrew!</h2>
      <p>Choose your Linkbrew username for <b>{email}</b>. You can always change it later.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Custom Path (username)"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          className="bg-white/5 text-white p-3 rounded-lg w-full"
          autoComplete="off"
        />
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-4 py-3 rounded-lg w-full shadow-md" type="submit">Set Username</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Setuserpath;
