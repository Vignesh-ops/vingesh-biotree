export default function SingerTheme({ profile, links }) {
  const Links = profile.bioLinks

    return (
      <div
        className="min-h-screen p-6 bg-gradient-to-tr from-pink-400 via-red-300 to-purple-700 text-white font-serif flex flex-col items-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1470&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <img
          src={profile.photoURL || "/avatar-placeholder.png"}
          alt={profile.displayName || profile.username}
          className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
        />
        <h1 className="text-4xl mt-4 font-bold tracking-wide drop-shadow-lg">
          {profile.displayName || profile.username}
        </h1>
        <p className="max-w-xl mt-2 text-white italic drop-shadow-md">{profile.bio}</p>
  
        <div className="mt-8 w-full max-w-md space-y-3">
        {Links.map((link,index) => (
            <a
              key={index}
              href={link.value.url}
              target="_blank"
              rel="noreferrer"
              className="block bg-black bg-opacity-40 rounded-md py-3 px-6 font-semibold text-white hover:bg-opacity-70 transition"
            >
              {link.value.id}
            </a>
          ))}
        </div>
      </div>
    );
  }
  