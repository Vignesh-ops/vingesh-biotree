export default function BasicTheme({ profile }) {
  const Links = profile?.bioLinks || [];
  console.log("****", Links);

  // Placeholder data if no real links exist
  const placeholderLinks = [
    { id: "Instagram", url: "#" },
    { id: "Twitter", url: "#" },
    { id: "YouTube", url: "#" },
  ];

  const displayLinks = Links.length > 0
    ? Links.map(link => ({
        id: link?.value?.id || "Untitled",
        url: link?.value?.url || "#",
      }))
    : placeholderLinks;

  return (
    <div className="min-h-screen p-8 bg-gray-50 text-gray-900 flex flex-col items-center font-sans">
      <img
        src={profile.photoURL || "/avatar-placeholder.png"}
        alt={profile.displayName || profile.username || "User"}
        className="w-28 h-28 rounded-full border-2 border-gray-300 object-cover"
      />
      <h1 className="text-3xl mt-3 font-semibold">
        {profile.displayName || profile.username || "Anonymous User"}
      </h1>
      <p className="mt-2 max-w-lg text-center text-gray-700">
        {profile.bio || "This user hasn’t written a bio yet."}
      </p>

      <div className="mt-8 w-full max-w-md space-y-3">
        {displayLinks?.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className={`block shadow-md rounded-md py-3 px-6 text-center font-medium transition ${
              Links.length > 0
                ? "bg-white hover:bg-gray-100"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {link.id}
          </a>
        ))}
      </div>
    </div>
  );
}
