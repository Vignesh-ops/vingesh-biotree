export default function SingerTheme({ profile }) {
  const Links = profile?.bioLinks || [];

  // Spotlight shimmer placeholder
  const ShimmerLink = ({ width }) => (
    <div
      className="relative rounded-md py-3 px-6 font-semibold bg-black bg-opacity-40 overflow-hidden"
      style={{ width }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-300/40 to-transparent animate-shimmer" />
      <span className="invisible">Placeholder</span>
    </div>
  );

  const shimmerWidths = ["85%", "65%", "75%"];

  const displayLinks =
    Links.length > 0
      ? Links.map((link) => ({
          id: link?.id || "Untitled Song",
          url: link?.url || "#",
        }))
      : [];

  return (
    <div
      className="min-h-screen p-6 text-white font-serif flex flex-col items-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1470&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <img
        src={profile.photoURL || "/avatar-placeholder.png"}
        alt={profile.displayName || profile.username || "Singer"}
        className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
      />
      <h1 className="text-4xl mt-4 font-bold tracking-wide drop-shadow-lg">
        {profile.displayName || profile.username || "Your Stage Name"}
      </h1>
      <p className="max-w-xl mt-2 italic drop-shadow-md">
        {profile.bio || "Write your music bio here..."}
      </p>

      <div className="mt-8 w-full max-w-md space-y-3">
        {displayLinks.length > 0
          ? displayLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="block bg-black bg-opacity-40 rounded-md py-3 px-6 font-semibold text-white hover:bg-opacity-70 transition"
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
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
}
