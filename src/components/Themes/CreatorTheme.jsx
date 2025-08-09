export default function CreatorTheme({ profile, links }) {
    return (
      <div
        className="min-h-screen p-6 bg-gradient-to-tr from-purple-400 via-pink-500 to-red-500 text-white flex flex-col items-center"
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <img
          src={profile.photoURL || "/avatar-placeholder.png"}
          alt={profile.displayName || profile.username}
          className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
        />
        <h1 className="text-4xl mt-4 font-bold drop-shadow-lg">
          {profile.displayName || profile.username}
        </h1>
        <p className="max-w-xl mt-2 text-lg italic drop-shadow-md">{profile.bio}</p>
  
        <div className="mt-8 w-full max-w-md space-y-4">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="block bg-white bg-opacity-30 hover:bg-opacity-50 rounded-lg py-3 px-6 font-semibold text-lg text-purple-900 transition"
            >
              {link.title}
            </a>
          ))}
        </div>
      </div>
    );
  }
  