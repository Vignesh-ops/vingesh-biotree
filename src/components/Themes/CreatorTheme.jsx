export default function CreatorTheme({ profile }) {
  const Links = profile?.bioLinks || [];

  // Shimmer placeholder component
  const ShimmerLink = ({ width }) => (
    <div
      className="relative rounded-lg py-3 px-6 font-semibold text-lg bg-white bg-opacity-20 overflow-hidden"
      style={{ width }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
      <span className="invisible">Placeholder</span>
    </div>
  );

  const shimmerWidths = ["85%", "65%", "75%"];

  const displayLinks =
    Links.length > 0
      ? Links.map((link) => ({
          id: link?.id || "Untitled",
          url: link?.url || "#",
        }))
      : [];

  return (
    <div
      className="min-h-screen p-6 text-white flex flex-col items-center"
      style={{
        fontFamily: "'Courier New', Courier, monospace",
        backgroundImage: `linear-gradient(to top right, rgba(128,0,128,0.7), rgba(255,105,180,0.7), rgba(255,0,0,0.7)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <img
        src={profile.photoURL || "/avatar-placeholder.png"}
        alt={profile.displayName || profile.username || "Creator"}
        className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
      />
      <h1 className="text-4xl mt-4 font-bold drop-shadow-lg">
        {profile.displayName || profile.username || "Your Name"}
      </h1>
      <p className="max-w-xl mt-2 text-lg italic drop-shadow-md">
        {profile.bio || "Share your creative journey here..."}
      </p>

      <div className="mt-8 w-full max-w-md space-y-4">
        {displayLinks.length > 0
          ? displayLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="block bg-white bg-opacity-30 hover:bg-opacity-50 rounded-lg py-3 px-6 font-semibold text-lg text-purple-900 transition"
              >
                {link.id}
              </a>
            ))
          : shimmerWidths.map((w, i) => <ShimmerLink key={i} width={w} />)}
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
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
