export default function SportsTheme({ profile, links }) {
  const Links = profile.bioLinks

    return (
      <div
        className="min-h-screen p-6 bg-gradient-to-r from-green-800 via-green-600 to-green-400 text-white font-sans flex flex-col items-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1470&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <img
          src={profile.photoURL || "/avatar-placeholder.png"}
          alt={profile.displayName || profile.username}
          className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
        />
        <h1 className="text-3xl mt-4 font-extrabold tracking-wide text-yellow-300 drop-shadow-lg">
          {profile.displayName || profile.username}
        </h1>
        <p className="max-w-xl mt-2 text-yellow-100 italic drop-shadow-md">{profile.bio}</p>
  
        <div className="mt-8 w-full max-w-md space-y-3">
        {Links.map((link,index) => (
            <a
              key={index}
              href={link.value.url}
              target="_blank"
              rel="noreferrer"
              className="block bg-yellow-400 bg-opacity-80 rounded-md py-3 px-6 font-bold text-green-900 hover:bg-opacity-100 transition"
            >
              {link.value.id}
            </a>
          ))}
        </div>
      </div>
    );
  }
  