export default function BusinessTheme({ profile }) {
  const Links = profile?.bioLinks || [];
  console.log("Link", Links);

  // Shimmer placeholder component
  const ShimmerLink = ({ width }) => (
    <div
      className={`rounded-md py-3 px-6 font-semibold text-lg bg-white bg-opacity-10 overflow-hidden relative`}
      style={{ width }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      <span className="invisible">Placeholder</span>
    </div>
  );

  const shimmerWidths = ["80%", "60%", "70%"];

  const displayLinks =
    Links.length > 0
      ? Links.map((link) => ({
          id: link?.id || "Untitled",
          url: link?.url || "#",
        }))
      : [];

  return (
    <div className="min-h-screen p-10 bg-gradient-to-b from-blue-900 via-blue-700 to-blue-600 text-white font-sans flex flex-col items-center">
      <img
        src={profile.photoURL || "/avatar-placeholder.png"}
        alt={profile.displayName || profile.username || "User"}
        className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
      />
      <h1 className="text-4xl mt-4 font-bold">
        {profile.displayName || profile.username || "Business Name"}
      </h1>
      <p className="mt-2 max-w-xl text-center italic">
        {profile.bio || "Your business tagline or description goes here."}
      </p>

      <div className="mt-8 w-full max-w-md space-y-4">
        {displayLinks.length > 0
          ? displayLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="block bg-white bg-opacity-20 rounded-md py-3 px-6 font-semibold text-lg hover:bg-opacity-40 transition text-blue-50"
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
