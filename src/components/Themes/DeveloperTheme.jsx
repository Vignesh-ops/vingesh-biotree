export default function DeveloperTheme({ profile }) {
  const Links = profile?.bioLinks || [];

  // Hacker-style shimmer placeholder
  const ShimmerLink = ({ width }) => (
    <div
      className="relative rounded py-3 px-5 font-semibold bg-green-900 overflow-hidden"
      style={{ width, fontFamily: "'Fira Code', monospace" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/40 to-transparent animate-shimmer" />
      <span className="invisible">Placeholder</span>
    </div>
  );

  const shimmerWidths = ["90%", "70%", "80%"];

  const displayLinks =
    Links.length > 0
      ? Links.map((link) => ({
          id: link?.id || "Untitled",
          url: link?.url || "#",
        }))
      : [];

  return (
    <div
      className="min-h-screen p-8 text-green-400 font-mono flex flex-col items-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1470&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "multiply",
        backgroundColor: "rgba(0,0,0,0.8)",
      }}
    >
      <div className="bg-black bg-opacity-70 rounded-lg p-6 max-w-md w-full shadow-lg">
        <img
          src={profile.photoURL || "/avatar-placeholder.png"}
          alt={profile.displayName || profile.username || "Developer"}
          className="w-28 h-28 rounded-full mx-auto border-2 border-green-500 object-cover mb-4"
        />
        <h1 className="text-4xl font-bold text-green-400 text-center mb-2">
          {profile.displayName || profile.username || "Your Name"}
        </h1>
        <p className="text-green-300 italic text-center mb-6">
          {profile.bio || "Write your hacker bio here..."}
        </p>

        <div className="space-y-3">
          {displayLinks.length > 0
            ? displayLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block bg-green-900 hover:bg-green-700 text-green-300 py-3 px-5 rounded font-semibold transition duration-200"
                  style={{ fontFamily: "'Fira Code', monospace" }}
                >
                  {link.id}
                </a>
              ))
            : shimmerWidths.map((w, i) => <ShimmerLink key={i} width={w} />)}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
}
