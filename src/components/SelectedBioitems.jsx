import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";
import { saveUserProfile } from "../features/userSlice"; // adjust path if needed

// Master list of supported platforms
const PLATFORMS = [
  { id: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourprofile", Icon: FaInstagram },
  { id: "twitter", label: "Twitter", placeholder: "https://twitter.com/yourprofile", Icon: FaTwitter },
  { id: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/yourprofile", Icon: FaLinkedin },
  { id: "whatsapp", label: "WhatsApp", placeholder: "https://wa.me/yourphonenumber", Icon: FaWhatsapp },
  { id: "gmail", label: "Gmail", placeholder: "your.email@gmail.com", Icon: FaEnvelope },
];

function SelectedBioitems({ initialBioLinks = [], onBack, onDone }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const theme = useSelector((state) => state.auth.theme);

  const validPlatformIds = PLATFORMS.map((p) => p.id);

  // ✅ Filter initialBioLinks so only valid platforms are used
  const [selectedPlatforms, setSelectedPlatforms] = useState(
    initialBioLinks
      .map((link) => link.id)
      .filter((id) => validPlatformIds.includes(id))
  );

  const [bioLinks, setBioLinks] = useState(() => {
    const obj = {};
    initialBioLinks.forEach(({ id, url }) => {
      if (validPlatformIds.includes(id)) {
        obj[id] = url;
      }
    });
    return obj;
  });

  const togglePlatform = (id) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );

    // Remove URL when unselected
    if (selectedPlatforms.includes(id)) {
      setBioLinks((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const handleUrlChange = (platform, url) => {
    setBioLinks((prev) => ({ ...prev, [platform]: url }));
  };

  const canProceed = selectedPlatforms.some(
    (p) => bioLinks[p] && bioLinks[p].trim() !== ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canProceed) {
      alert("Please select at least one platform and enter URL/email.");
      return;
    }

    const bioLinksArray = selectedPlatforms
      .filter((id) => bioLinks[id]?.trim() !== "")
      .map((id) => ({ id, url: bioLinks[id].trim() }));

    dispatch(
      saveUserProfile({
        uid: user?.uid,
        bioLinks: bioLinksArray,
      })
    ).then(() => {
      if (onDone) onDone();
    });
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-white">
        Choose your bio platforms
      </h2>

      {/* Icon grid */}
      <div className="flex gap-4 flex-wrap mb-6">
        {PLATFORMS.map(({ id, label, Icon }) => {
          const selected = selectedPlatforms.includes(id);
          return (
            <div
              key={id}
              onClick={() => togglePlatform(id)}
              className={`flex flex-col items-center cursor-pointer p-3 rounded-lg border-2
                ${selected ? "border-rose-500 bg-rose-700" : "border-gray-600 bg-gray-800"}
                hover:border-rose-400 hover:bg-rose-600 transition-colors duration-300`}
              title={label}
            >
              <Icon size={32} className="mb-1" />
              <span className="text-white text-sm select-none">{label}</span>
            </div>
          );
        })}
      </div>

      {/* Form inputs */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {selectedPlatforms.map((platform) => {
          const match = PLATFORMS.find((p) => p.id === platform);

          // ✅ Skip if platform not found in PLATFORMS
          if (!match) return null;

          const { placeholder, label } = match;
          return (
            <div key={platform}>
              <label className="block mb-1 text-white font-medium">
                {label} URL / Email:
              </label>
              <input
                type={platform === "gmail" ? "email" : "url"}
                placeholder={placeholder}
                value={bioLinks[platform] || ""}
                autoComplete="on"
                onChange={(e) => handleUrlChange(platform, e.target.value)}
                className="bg-white/5 text-white p-3 rounded-lg w-full outline-none border border-transparent
                focus:border-rose-500 transition-colors"
                required
              />
            </div>
          );
        })}

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 bg-gray-600 rounded text-white hover:bg-gray-700 transition"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!canProceed}
            className={`px-4 py-2 rounded text-white ${canProceed
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-rose-400 cursor-not-allowed"
              } transition`}
          >
            Save Bio Links
          </button>
        </div>
      </form>
    </div>
  );
}

export default SelectedBioitems;
