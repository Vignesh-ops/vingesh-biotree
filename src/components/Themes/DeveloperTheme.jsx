export default function DeveloperTheme({ profile, links }) {
  const Links = profile.bioLinks

    return (
      <div
        className="min-h-screen p-8 bg-gray-900 text-green-400 font-mono flex flex-col items-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1470&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "multiply",
        }}
      >
        <div className="bg-black bg-opacity-70 rounded-lg p-6 max-w-md w-full shadow-lg">
          <img
            src={profile.photoURL || "/avatar-placeholder.png"}
            alt={profile.displayName || profile.username}
            className="w-28 h-28 rounded-full mx-auto border-2 border-green-500 object-cover mb-4"
          />
          <h1 className="text-4xl font-bold text-green-400 text-center mb-2">
            {profile.displayName || profile.username}
          </h1>
          <p className="text-green-300 italic text-center mb-6">{profile.bio}</p>
  
          <div className="space-y-3">
          {Links.map((link,index) => (
            <a
              key={index}
              href={link.value.url}
                target="_blank"
                rel="noreferrer"
                className="block bg-green-900 hover:bg-green-700 text-green-300 py-3 px-5 rounded font-semibold transition duration-200"
                style={{ 
                  fontFamily: "'Fira Code', monospace" 
                }}
              >
                {link.value.id}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }
  