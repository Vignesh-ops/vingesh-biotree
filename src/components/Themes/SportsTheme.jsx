export default function SportsTheme({ profile }) {
  const Links = profile?.bioLinks || [];

  // Stadium light shimmer placeholder
  const ShimmerLink = ({ width }) => (
    <div
      className="relative rounded-md py-3 px-6 font-bold bg-yellow-400 bg-opacity-80 overflow-hidden"
      style={{ width }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
      <span className="invisible">Placeholder</span>
    </div>
  );

  const shimmerWidths = ["90%", "75%", "60%"];

  const displayLinks =
    Links.length > 0
      ? Links.map((link) => ({
          id: link?.id || "Untitled Game",
          url: link?.url || "#",
        }))
      : [];

  return (
    <div
      className="min-h-screen p-6 text-white font-sans flex flex-col items-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1470&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <img
        src={profile.photoURL || "/avatar-placeholder.png"}
        alt={profile.displayName || profile.username || "Athlete"}
        className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
      />
      <h1 className="text-3xl mt-4 font-extrabold tracking-wide text-yellow-300 drop-shadow-lg">
        {profile.displayName || profile.username || "Your Sports Name"}
      </h1>
      <p className="max-w-xl mt-2 italic drop-shadow-md text-yellow-100">
        {profile.bio || "Your sports journey starts here..."}
      </p>

      <div className="mt-8 w-full max-w-md space-y-3">
        {displayLinks.length > 0
          ? displayLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="block bg-yellow-400 bg-opacity-80 rounded-md py-3 px-6 font-bold text-green-900 hover:bg-opacity-100 transition"
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
          animation: shimmer 1.8s infinite linear;
        }
      `}</style>
    </div>
  );
}
