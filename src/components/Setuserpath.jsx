import { useState } from "react";
import { collection, query,serverTimestamp, where, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase"; // adjust path

function Setuserpath({ email, onComplete, user }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const checkUsernameExists = async (uname) => {
    try {
      if (!uname || uname.length < 3) return false;
  
      // Query directly in 'users' collection
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", uname.toLowerCase()));
  
      const snap = await getDocs(q);
      console.log('snap', snap);
  
      // If at least 1 document matches, username exists
      return !snap.empty;
      
    } catch (error) {
      console.error("Error checking username:", error);
      return true; // Fail-safe to prevent duplicates
    }
  };

  // const saveUserProfile = async (uid, uname, socials = {}) => {
  //   await setDoc(doc(db, "users", uid,"profile", "info"), {
  //     username: uname,
  //     ...socials,
  //   }, { merge: true });
  // };

  const saveUserProfile = async (uid, uname, socials = {}) => {
    try {
      console.log('uid',uid)
      // Correct path with even segments
      const profileRef = doc(db, "users", uid);
      console.log('profileRef',profileRef)
      await setDoc(profileRef, {
        username: uname,
        email: user.email, // Include email from props
        createdAt: serverTimestamp(), // Add timestamp
        updatedAt: serverTimestamp(),
        ...socials,
      }, { merge: true });
      
    } catch (error) {
      console.error("Error saving profile:", error);
      throw error; // Re-throw to handle in calling function
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    const exists = await checkUsernameExists(username);

    if (exists && username !== user.username) {
      setError("Username already taken. Please choose another.");
      return;
    }

    setError("");
    try {
      await saveUserProfile(user.uid, username);
      onComplete(username);
    } catch (err) {
      setError("Failed to save username. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-400 p-4">
      <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-3">
          🚀 Welcome to Linkbrew!
        </h2>
        <p className="text-gray-600 mb-6">
          Choose your Linkbrew username for <b>{user.email}</b>.  
          You can always change it later.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Custom Path (username)"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-transparent focus:border-purple-500 focus:ring-2 focus:ring-purple-400 outline-none transition-all text-gray-800 placeholder-gray-500"
              autoComplete="off"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Set Username
          </button>
        </form>
      </div>
    </div>
  );
}

export default Setuserpath;
